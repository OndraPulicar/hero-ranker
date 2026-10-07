'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutCurrentUser } from '@/services/auth.service';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config';
import { SearchResultSchema } from '@hero-ranker/shared/schemas/search';

export default function Header() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  const { data: userInfo } = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutCurrentUser,
    onSuccess: async () => {
      await queryClient.setQueryData(['me'], null);

      router.push('/login');
    },
  });

  const handleLogOutOnClick = () => {
    logoutMutation.mutate();
  };

  const { data: searchResult } = useQuery({
    queryKey: ['search', debouncedSearchQuery],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/search?q=${debouncedSearchQuery}`,
      );
      if (!response.ok) {
        throw new Error('Search failed.');
      }
      const responseJson = (await response.json()) as unknown;

      const res = SearchResultSchema.parse(responseJson);

      return res;
    },
    enabled: debouncedSearchQuery.length >= 2,
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-muted text-background">
      <section className="">
        <Link className="text-xl font-bold text-background" href="/">
          HeroRanker
        </Link>
      </section>
      <section className="flex gap-2">
        <input
          className="w-80 px-4 py-1 rounded-full text-text bg-background outline-none"
          type="text"
          placeholder="Search..."
          onChange={(event) => {
            return setSearchQuery(event.target.value);
          }}
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
      <div>{JSON.stringify(searchResult)}</div>
    </header>
  );
}
