import dotenv from 'dotenv';
dotenv.config();

export const PROJECT_ID = process.env.PROJECT_ID!;
export const OAUTH_ISSUER_URL = process.env.OAUTH_ISSUER_URL!;
export const BASE_URL = process.env.BASE_URL!;
export const DOCS_URL = process.env.DOCS_URL!;
export const PORT = process.env.PORT || 8080;
