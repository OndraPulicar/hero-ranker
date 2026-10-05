'use client';

import { API_URL } from '@/config';
import { UserInfoSchema } from '@hero-ranker/shared/schemas/user';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (response.status === 401) {
        return undefined;
      }

      const responseJson = (await response.json()) as unknown;

      return UserInfoSchema.parse(responseJson);
    },
  });

  const handleLogOutOnClick = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    await queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-muted text-background">
      <section className="">
        <span className="text-xl font-bold text-background">HeroRanker</span>
      </section>
      <section className="flex gap-2">
        <input
          className="w-80 px-4 py-1 rounded-full text-text bg-background outline-none"
          type="text"
          placeholder="Search..."
        />
        <button
          className="px-4 py-1 rounded-full bg-primary hover:bg-surface text-text"
          type="submit"
        >
          Search
        </button>
      </section>
      <section>
        {userInfo && (
          <span>
            {userInfo.username} ({userInfo.email}){' '}
            <button
              onClick={() => {
                void handleLogOutOnClick();
              }}
              className="underline text-primary cursor-pointer"
            >
              log out
            </button>
          </span>
        )}
        {!userInfo && <Link href="/login">log in</Link>}
      </section>
    </header>
  );
}
