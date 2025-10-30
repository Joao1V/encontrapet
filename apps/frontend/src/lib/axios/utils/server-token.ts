'use server';

import { getApiToken } from '@/app/api/auth';

export async function getServerToken() {
   return await getApiToken();
}
