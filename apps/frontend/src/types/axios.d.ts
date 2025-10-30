import type { Options } from '@/lib/axios';
import 'axios';

declare module 'axios' {
   export interface AxiosRequestConfig {
      options?: Options | null;
   }
}
