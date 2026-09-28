import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ===================================================================
// SERVER-SIDE ONLY — Admin Account Management API
// Sensitive credentials are NEVER exposed to the client bundle.
// ===================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * POST /api/admin/account
 *
 * Supported actions:
 *   - "change_password"   { action, userId, currentPassword, newPassword }
 *   - "change_email"      { action, userId, currentPassword, newEmail }
 *
 * Security model:
 *   1. The caller provides their userId and currentPassword.
 *   2. We verify the current password by attempting a sign-in with the
 *      Supabase client-side Auth API (scoped to the anon key), ensuring
 *      the caller actually knows the current credentials.
 *   3. Only after successful verification do we use the service-role key
 *      to perform the privileged mutation.
 *   4. For email changes, Supabase sends a confirmation link to the new
 *      address automatically when using `updateUserById`.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, currentPassword, newPassword, newEmail } = body;

    if (!action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: action, userId.' },
        { status: 400 }
      );
    }

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required for all account changes.' },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Server configuration incomplete. SUPABASE_SERVICE_ROLE_KEY is not set.' },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------------
    // STEP 1 — Verify the current password via standard auth sign-in
    // We fetch the user first to get their email, then authenticate.
    // ---------------------------------------------------------------
    const { data: userData, error: fetchError } = await adminClient.auth.admin.getUserById(userId);

    if (fetchError || !userData?.user) {
      return NextResponse.json(
        { error: 'Unable to locate the administrator account.' },
        { status: 404 }
      );
    }

    const currentEmail = userData.user.email;
    if (!currentEmail) {
      return NextResponse.json(
        { error: 'Administrator account has no email on file.' },
        { status: 400 }
      );
    }

    // Create a disposable anon client just for password verification
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const verifyClient = createClient(SUPABASE_URL, ANON_KEY);

    const { error: signInError } = await verifyClient.auth.signInWithPassword({
      email: currentEmail,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Current password is incorrect. Please try again.' },
        { status: 401 }
      );
    }

    // Sign out the disposable verification session immediately
    await verifyClient.auth.signOut();

    // ---------------------------------------------------------------
    // STEP 2 — Execute the requested privileged mutation
    // ---------------------------------------------------------------

    if (action === 'change_password') {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      if (newPassword === currentPassword) {
        return NextResponse.json(
          { error: 'New password must be different from the current password.' },
          { status: 400 }
        );
      }

      const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message || 'Failed to update password.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully. Use the new password on your next sign-in.',
      });
    }

    if (action === 'change_email') {
      if (!newEmail || !newEmail.includes('@')) {
        return NextResponse.json(
          { error: 'Please provide a valid new email address.' },
          { status: 400 }
        );
      }

      const cleanNewEmail = newEmail.trim().toLowerCase();

      if (cleanNewEmail === currentEmail.toLowerCase()) {
        return NextResponse.json(
          { error: 'The new email is the same as your current email.' },
          { status: 400 }
        );
      }

      // Check if the new email is already taken
      const { data: existingUsers } = await adminClient.auth.admin.listUsers();
      const emailTaken = existingUsers?.users?.some(
        (u) => u.email?.toLowerCase() === cleanNewEmail && u.id !== userId
      );

      if (emailTaken) {
        return NextResponse.json(
          { error: 'This email address is already associated with another account.' },
          { status: 409 }
        );
      }

      // Update the email. Supabase will send a confirmation link to the
      // new address when `email_confirm` is false (the default behaviour
      // for email changes via the Admin API when the project has email
      // confirmations enabled).
      const { error: emailError } = await adminClient.auth.admin.updateUserById(userId, {
        email: cleanNewEmail,
      });

      if (emailError) {
        return NextResponse.json(
          { error: emailError.message || 'Failed to update email address.' },
          { status: 500 }
        );
      }

      // Also update the profiles table to keep it in sync
      await adminClient
        .from('profiles')
        .update({ email: cleanNewEmail, updated_at: new Date().toISOString() })
        .eq('id', userId);

      return NextResponse.json({
        success: true,
        message:
          'Email change initiated. If email confirmations are enabled, Supabase has sent a verification link to the new address. The change will take full effect once confirmed.',
        newEmail: cleanNewEmail,
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error('Admin account API error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
