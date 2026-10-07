import { API_URL } from '@/config';
import { UserInfo, UserInfoSchema } from '@hero-ranker/shared/schemas/user';

export const getCurrentUser = async (): Promise<UserInfo | null> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load user (${response.status})`);
  }

  const responseJson = (await response.json()) as unknown;

  return UserInfoSchema.parse(responseJson);
};

export const logoutCurrentUser = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed.');
  }
};
