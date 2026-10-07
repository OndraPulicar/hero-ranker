'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutCurrentUser } from '@/services/auth.service';

export default function Header() {
  const queryClient = useQueryClient();
  const router = useRouter();
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
