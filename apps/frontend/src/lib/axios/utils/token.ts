import { isServer } from '../utils/constants';
import { getServerToken } from './server-token';

// Store a transient client-side token copy to avoid repeated session fetches in a single tab lifecycle
let clientAccess: string | null = null;

export const getToken = async (): Promise<string | null> => {
   if (isServer) {
      const token = await getServerToken();
      return token ?? null;
   }

   if (clientAccess) return clientAccess;

   try {
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      const token = (session as any)?.token ?? null;
      if (token) clientAccess = token;
      return token;
   } catch (e) {
      return null;
   }
};

export const saveToken = (token: string | null) => {
   if (!isServer) clientAccess = token;
};
