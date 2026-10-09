'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutCurrentUser } from '@/services/auth.service';
import { useEffect, useState, useRef } from 'react';
import { search } from '@/services/search.service';

export default function Header() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        event.target instanceof Node &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

  const { data: searchResult } = useQuery({
    queryKey: ['search', debouncedSearchQuery],
    queryFn: async () => search(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length >= 2,
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-muted text-background">
      <section className="">
        <Link className="text-xl font-bold text-background" href="/">
          HeroRanker
        </Link>
      </section>
      <section className="relative flex gap-2">
        <input
          className="w-80 px-4 py-1 rounded-full text-text bg-background outline-none"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(event) => {
            setIsSearchOpen(true);
            return setSearchQuery(event.target.value);
          }}
        />
        <button
          className="px-4 py-1 rounded-full bg-primary hover:bg-surface text-text"
          type="submit"
        >
          Search
        </button>
        {isSearchOpen && searchResult && (
          <div
            ref={searchRef}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl bg-surface shadow-xl ring-1 ring-black/5"
          >
            {searchResult.characters.length > 0 && (
              <div>
                <div className="px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Characters
                </div>
                <div className="pb-2">
                  {searchResult.characters.map((character) => (
                    <Link
                      key={character.id}
                      href={`/characters/${character.id}`}
                      onClick={clearSearch}
                      className="block px-4 py-2.5 transition-colors hover:bg-background"
                    >
                      <div className="font-medium text-text">
                        {character.name}
                      </div>
                      <div className="text-sm text-muted">
                        {character.series.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {searchResult.series.length > 0 && (
              <div className="border-t border-muted/20">
                <div className="px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Series
                </div>
                <div className="pb-2">
                  {searchResult.series.map((series) => (
                    <Link
                      key={series.id}
                      href={`/series/${series.id}`}
                      onClick={clearSearch}
                      className="block px-4 py-2.5 transition-colors hover:bg-background"
                    >
                      <div className="font-medium text-text">
                        {series.title}
                      </div>
                      <div className="text-sm text-muted">
                        {series.yearOfProduction}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {searchResult.characters.length === 0 &&
              searchResult.series.length === 0 && (
                <div className="px-4 py-5 text-center text-sm text-muted">
                  No results found
                </div>
              )}
          </div>
        )}
      </section>
      <section>
        {userInfo && (
          <span>
            {userInfo.username} ({userInfo.email})
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
