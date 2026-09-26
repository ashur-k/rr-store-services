import { useQuery } from '@tanstack/react-query'

import {
  getCurrentUser,
  type CurrentUser,
} from '../api/getCurrentUser'

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  })
}