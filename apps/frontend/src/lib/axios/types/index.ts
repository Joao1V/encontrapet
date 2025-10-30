import type { Method } from 'axios';
import { z } from 'zod';

export type Options = {
   isDisableToast?: boolean;
   userToken?: string;
};

export type RequestParams<T> = {
   method: Method;
   url: string;
   params?: any;
   data?: T;
   options?: Options;
};

export const MetaSchema = z.object({
   hasNextPage: z.boolean(),
   hasPrevPage: z.boolean(),
   limit: z.number().int(),
   nextPage: z.number().int().nullable(),
   page: z.number().int(),
   pagingCounter: z.number().int(),
   prevPage: z.number().int().nullable(),
   totalDocs: z.number().int(),
   totalPages: z.number().int(),
});

export type Meta = z.infer<typeof MetaSchema>;

export type PaginateResponse<T> = Meta & {
   docs: T;
};

export type ApiResponse<T = any> = {
   message: string;
   exp: number;
   token: string;
   errors?: Record<string, string[]>;
};
