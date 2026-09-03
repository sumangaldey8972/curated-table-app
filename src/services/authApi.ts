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
