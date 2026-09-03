import { apiRequest } from './apiClient';
import { User } from '../types';

/** Shape of the user object returned by curated-table-be. */
export interface BackendUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string | null;
  roles?: { _id: string; name: string }[];
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

interface LoginResponse {
  token: string;
  user: BackendUser;
}

/**
 * POST /api/auth/login — email OR phone number + password.
 * Returns the JWT and the backend user profile.
 */
export function loginRequest(identifier: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: { identifier: identifier.trim(), password },
  });
}

/** GET /api/auth/me — resolves the logged-in profile from the stored token. */
export function getMeRequest() {
  return apiRequest<BackendUser>('/auth/me', { method: 'GET' });
}

const normEmail = (email: string) => email.trim().toLowerCase();

/** Backend error code returned by /auth/login when the account is unverified. */
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

/**
 * POST /api/auth/verify-otp (type: email_verification) — checks the code WITHOUT
 * consuming it, so the client can then offer an optional "set new password" step.
 * The code is spent by completeVerificationRequest.
 */
export function verifyEmailOtpRequest(email: string, otp: string) {
  return apiRequest<{ verified: boolean }>('/auth/verify-otp', {
    method: 'POST',
    auth: false,
    body: { email: normEmail(email), otp: otp.trim(), type: 'email_verification' },
  });
}

/**
 * POST /api/auth/complete-verification — consumes the email-verification code,
 * flips isEmailVerified to true, and optionally sets a new password. Omit
 * `newPassword` to keep the administrator-assigned password.
 */
export function completeVerificationRequest(
  email: string,
  otp: string,
  newPassword?: string
) {
  return apiRequest<BackendUser>('/auth/complete-verification', {
    method: 'POST',
    auth: false,
    body: {
      email: normEmail(email),
      otp: otp.trim(),
      ...(newPassword ? { newPassword } : {}),
    },
  });
}

/** POST /api/auth/resend-otp (type: email_verification) — sends a fresh code. */
export function resendEmailOtpRequest(email: string) {
  return apiRequest<{ expiresAt: string }>('/auth/resend-otp', {
    method: 'POST',
    auth: false,
    body: { email: normEmail(email), type: 'email_verification' },
  });
}

/** POST /api/auth/forgot-password — emails a 6-digit reset code (valid 2 min). */
export function forgotPasswordRequest(email: string) {
  return apiRequest<{ expiresAt: string }>('/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: { email: normEmail(email) },
  });
}

/**
 * POST /api/auth/verify-otp (type: forgot_password) — checks the reset code
 * WITHOUT consuming it. The code is spent later by resetPasswordRequest.
 */
export function verifyResetOtpRequest(email: string, otp: string) {
  return apiRequest<{ verified: boolean }>('/auth/verify-otp', {
    method: 'POST',
    auth: false,
    body: { email: normEmail(email), otp: otp.trim(), type: 'forgot_password' },
  });
}

/** POST /api/auth/resend-otp (type: forgot_password) — sends a fresh reset code. */
export function resendResetOtpRequest(email: string) {
  return apiRequest<{ expiresAt: string }>('/auth/resend-otp', {
    method: 'POST',
    auth: false,
    body: { email: normEmail(email), type: 'forgot_password' },
  });
}

/** POST /api/auth/reset-password — consumes the code and sets the new password. */
export function resetPasswordRequest(email: string, otp: string, newPassword: string) {
  return apiRequest<null>('/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: { email: normEmail(email), otp: otp.trim(), newPassword },
  });
}

/**
 * Maps a lean backend user onto the rich frontend `User` model the UI expects.
 * Fields the backend does not track yet are filled with neutral placeholders
 * (same approach as the local `register` flow in AppContext).
 */
export function adaptBackendUser(backend: BackendUser): User {
  const fullName = `${backend.firstName ?? ''} ${backend.lastName ?? ''}`.trim() || 'Member';
  const phone =
    backend.phoneNumber != null && backend.phoneNumber !== ''
      ? `${backend.countryCode ?? ''} ${backend.phoneNumber}`.trim()
      : '+91 98300 00000';
  const joinedYear = backend.createdAt
    ? new Date(backend.createdAt).getFullYear()
    : new Date().getFullYear();

  return {
    id: backend._id,
    name: fullName,
    roles: (backend.roles ?? []).map(r => r.name).filter(Boolean),
    designation: 'Director',
    companyName: 'Business Enterprises',
    industry: 'Manufacturing',
    chapter: 'Kolkata Central Chapter',
    location: 'Kolkata, WB',
    gstNumber: '19AAAAA0000A1Z5',
    isGstVerified: Boolean(backend.isEmailVerified),
    turnover: '₹10 Cr - ₹25 Cr',
    yearJoined: joinedYear,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    membershipTier: 'Executive Member',
    bio: 'Curated Table active executive member.',
    requirementDocs: [],
    contact: {
      email: backend.email,
      phone,
      website: 'https://curatedtable.app',
      officeAddress: 'Kolkata, West Bengal',
    },
    stats: {
      oneToOneCount: 0,
      referralsGiven: 0,
      referralsReceived: 0,
      businessValueInLakhs: 0,
    },
  };
}
