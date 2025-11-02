declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URI: string;
    PAYLOAD_SECRET: string;

    // Email Configuration
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASS: string;

    // AWS S3 Storage
    S3_BUCKET: string;
    S3_REGION: string;
    S3_ACCESS_KEY_ID: string;
    S3_SECRET_ACCESS_KEY: string;
    S3_ENDPOINT: string;
  }
}
