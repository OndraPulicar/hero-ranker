'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutCurrentUser } from '@/services/auth.service';
import SearchBar from './SearchBar';

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
      <SearchBar />
      <section>
        {userInfo && (
          <span>
            {userInfo.username} ({userInfo.email})&nbsp;
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
