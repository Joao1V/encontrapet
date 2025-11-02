import { QUERY_KEYS } from '@/config/constants';
import { useQuery } from '@tanstack/react-query';
import { publishApi } from './api';

export function usePostsQuery() {
   return useQuery({
      queryKey: [QUERY_KEYS.POSTS],
      queryFn: publishApi.listPosts,
   });
}

export function useMyPostsQuery() {
   return useQuery({
      queryKey: [QUERY_KEYS.MY_POSTS],
      queryFn: publishApi.listMyPosts,
   });
}
