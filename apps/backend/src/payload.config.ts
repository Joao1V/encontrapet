import {
   Animals,
   Feedback,
   Locations,
   Media,
   Photos,
   Products,
   Publications,
   Users,
} from '@/collections';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { openapi, swaggerUI } from 'payload-oapi';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
   admin: {
      user: Users.slug,
      importMap: {
         baseDir: path.resolve(dirname),
      },
   },
   cors: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
   ],
   csrf: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
   ],
   collections: [Products, Users, Locations, Animals, Photos, Publications, Feedback],
   editor: lexicalEditor(),
   secret: process.env.PAYLOAD_SECRET || '',
   typescript: {
      outputFile: path.resolve(dirname, '../../../payload-types.ts'),
   },
   db: postgresAdapter({
      pool: {
         connectionString: process.env.DATABASE_URI || '',
      },
   }),
   plugins: [
      s3Storage({
         collections: {
            photos: {
               prefix: 'teste/photos',
            },
            media: {
               prefix: 'media',
            },
         } as any,
         bucket: process.env.S3_BUCKET || '',
         config: {
            credentials: {
               accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
               secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
            region: process.env.S3_REGION || 'us-east-1',
            ...(process.env.S3_ENDPOINT && { endpoint: process.env.S3_ENDPOINT }),
         },
      }),
      openapi({
         openapiVersion: '3.1',
         metadata: {
            title: 'EncontraPet API',
            version: '1.0.0',
            description: 'API para sistema de busca e cadastro de animais perdidos, encontrados e para adoção',
         },
         access: {
            spec: () => true,
         },
      }),
      swaggerUI({
         path: '/docs',
         access: () => true,
      }),
   ],
});
