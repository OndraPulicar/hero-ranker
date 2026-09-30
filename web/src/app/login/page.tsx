'use client';

import { API_URL } from '@/config';
import { LoginErrorSchema } from '@hero-ranker/shared/schemas/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type LoginFormData = {
  email: string;
  password: string;
};

const logIn = async (data: LoginFormData): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseJson = (await response.json()) as unknown;

  if (!response.ok) {
    const errorResponse = LoginErrorSchema.parse(responseJson);
    throw new Error(errorResponse.message);
  }
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await logIn(data);
      setError(undefined);
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
        className="w-full max-w-md bg-surface rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text">Welcome back</h1>
          <p className="mt-2 text-muted">Log in to your Hero Ranker account</p>
          {error && <p className="mt-2 text-primary">{error}</p>}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-text"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-muted/40 bg-background px-4 py-3
                text-text placeholder:text-muted/50
                outline-none transition
                focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register('email')}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-text"
              >
                Password
              </label>

              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-muted/40 bg-background px-4 py-3
                text-text placeholder:text-muted/50
                outline-none transition
                focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register('password')}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-primary px-4 py-3
                   font-semibold text-white
                   transition hover:brightness-110
                   active:scale-[0.98]"
          >
            Log in
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-primary hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
