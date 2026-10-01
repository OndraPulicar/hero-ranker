'use client';

import { API_URL } from '@/config';
import { UserInfo, UserInfoSchema } from '@hero-ranker/shared/schemas/user';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

  useEffect(() => {
    const getMe = async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return;
      }

      const responseJson = (await response.json()) as unknown;
      const userInfo = UserInfoSchema.parse(responseJson);

      setUserInfo(userInfo);
    };

    void getMe();
  }, []);

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
            {userInfo.username} ({userInfo.email})
          </span>
        )}
        {!userInfo && <Link href="/login">log in</Link>}
      </section>
    </header>
  );
}
