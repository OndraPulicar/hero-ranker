'use client';

import LoginForm from '@/features/auth/components/LoginForm';
import useLogin from '@/features/auth/hooks/useLogin';

export default function Login() {
  const { submit, error } = useLogin();

  return (
    <LoginForm error={error} onSubmit={(credentials) => submit(credentials)} />
  );
}
