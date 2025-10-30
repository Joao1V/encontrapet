import { NEXTAUTH_PREFIX_COOKIE_NAME } from '@/app/api/helpers/constants';
import type { NextRequest } from 'next/server';

const NEXTAUTH_COOKIES = [
   `__Secure-${NEXTAUTH_PREFIX_COOKIE_NAME}.session-token`,
   `${NEXTAUTH_PREFIX_COOKIE_NAME}.session-token`,
];

export function hasActiveSession(req: NextRequest) {
   return NEXTAUTH_COOKIES.some((name) => !!req.cookies.get(name)?.value);
}
