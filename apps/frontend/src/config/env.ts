export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

export const IS_PRODUCTION = ENVIRONMENT === 'production';

export const IS_STAGING = ENVIRONMENT === 'staging';

export const IS_DEV = ENVIRONMENT === 'development';

// #API URL
export const API_BASE_URL_MAIN = process.env.NEXT_PUBLIC_API_BASE_URL_MAIN;
