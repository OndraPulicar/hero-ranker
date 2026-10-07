import { API_URL } from '@/config';
import { LoginErrorSchema } from '@hero-ranker/shared/schemas/auth';
import { UserInfo, UserInfoSchema } from '@hero-ranker/shared/schemas/user';

export type LoginCredentials = {
  email: string;
  password: string;
};

export const loginUser = async ({
  email,
  password,
}: LoginCredentials): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const responseJson = (await response.json()) as unknown;

  if (!response.ok) {
    const errorResponse = LoginErrorSchema.parse(responseJson);
    throw new Error(errorResponse.message);
  }
};

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
