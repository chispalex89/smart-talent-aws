import type {
  UserMigrationAuthenticationTriggerEvent,
  UserMigrationForgotPasswordTriggerEvent,
  Context,
} from 'aws-lambda';
import crypto from 'crypto';
import { PasswordHash } from 'phpass';
import bcrypt from 'bcryptjs';

// If you declared env in resource.ts, use Amplify's typed env:
// import { env } from '$amplify/env/user-migration';

// Dummy adapter: replace with your real lookup (e.g. mysql2/pg using env vars)
async function findLegacyUser(usernameOrEmail: string) {
  // Query your legacy DB and return at least: { id, email, username, password_hash }
  return null as any;
}

function verifyLegacyPassword(plain: string, hash: string): boolean {
  // WordPress "portable phpass" hashes start with $P$ or $H$
  if (hash.startsWith('$P$') || hash.startsWith('$H$')) {
    const hasher = new PasswordHash(8, true);;
    return hasher.CheckPassword(plain, hash);
    // return false; // TODO: implement phpass check
  }
  // WP may also contain bcrypt ($2a/$2y/$2b)
  if (
    hash.startsWith('$2a$') ||
    hash.startsWith('$2y$') ||
    hash.startsWith('$2b$')
  ) {
    return bcrypt.compareSync(plain, hash);
    // return false; // TODO: implement bcrypt check
  }
  // Check for 32-char hex MD5
  if (/^[a-f0-9]{32}$/i.test(hash)) {
    const md5 = crypto.createHash('md5').update(plain).digest('hex');
    return md5 === hash;
  }
  return false;
}

export const handler = async (
  event:
    | UserMigrationAuthenticationTriggerEvent
    | UserMigrationForgotPasswordTriggerEvent,
  _ctx: Context
) => {
  const { triggerSource, userName } = event;

  // Runs when a non-existent user tries to sign in
  if (triggerSource === 'UserMigration_Authentication') {
    const password = event.request.password!;
    const legacy = await findLegacyUser(userName);
    if (!legacy) throw new Error('User not found in legacy store');
    if (!verifyLegacyPassword(password, legacy.password_hash)) {
      throw new Error('Bad password');
    }

    // Tell Cognito to create the user NOW with these attributes and mark them confirmed
    event.response.userAttributes = {
      email: legacy.email,
      email_verified: 'true',
      preferred_username: legacy.username ?? userName,
    };
    event.response.finalUserStatus = 'CONFIRMED';
    return event;
  }

  // Runs when a non-existent user requests "forgot password"
  if (triggerSource === 'UserMigration_ForgotPassword') {
    const legacy = await findLegacyUser(userName);
    if (!legacy) throw new Error('User not found in legacy store');

    // Create the user but require a reset
    event.response.userAttributes = {
      email: legacy.email,
      email_verified: 'true',
      preferred_username: legacy.username ?? userName,
    };
    event.response.finalUserStatus = 'RESET_REQUIRED';
    return event;
  }

  return event;
};
