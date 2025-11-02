declare namespace NodeJS {
   interface ProcessEnv {
      // API Configuration
      NEXT_PUBLIC_ENVIRONMENT: 'development' | 'production' | 'staging';
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      NEXT_PUBLIC_API_URL: string;

      // NextAuth Configuration
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
   }
}
