'use client';

import { loginUser } from '@/services/auth.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push('/');
    },
  });

  return {
    submit: loginMutation.mutate,
    error: loginMutation.error,
  };
}
