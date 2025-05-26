import express from 'express';
import morgan from 'morgan';
import {
  mcpAuthMetadataRouter,
} from '@modelcontextprotocol/sdk/server/auth/router.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { createProxyProvider } from './services/authService';
import mcpRoutes from './routes/mcpRoutes';
import { OAUTH_ISSUER_URL, BASE_URL, DOCS_URL, PORT } from './config';
import { db } from './services/firestoreService';
import packageJson from '../package.json';

const proxyProvider = createProxyProvider(db);

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Switched to using the `mcpAuthMetadataRouter` here:
app.use(
  mcpAuthMetadataRouter({
    oauthMetadata: {
      issuer: OAUTH_ISSUER_URL,
      authorization_endpoint: `${OAUTH_ISSUER_URL}/oauth/authorize`,
      token_endpoint: `${OAUTH_ISSUER_URL}/oauth/token`,
      registration_endpoint: 
        `${OAUTH_ISSUER_URL}/oauth/register`,
      scopes_supported: ['default'],
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
      service_documentation: DOCS_URL,
      revocation_endpoint: 
        `${OAUTH_ISSUER_URL}/oauth/revoke`,
      code_challenge_methods_supported: ['S256'],
    },
    resourceServerUrl: new URL(BASE_URL),
    serviceDocumentationUrl: new URL(DOCS_URL),
    scopesSupported: ['default'],
    resourceName: packageJson.name,
  }),
);

// Still using the `proxyProvider` for it's implementation of `verifyToken`:
app.use(
  '/mcp',
  requireBearerAuth({
    verifier: proxyProvider,
    requiredScopes: ['default'],
    resourceMetadataUrl: new URL(OAUTH_ISSUER_URL).toString(),
  }),
  mcpRoutes,
);

app.listen(PORT, () => {
  console.log(`${packageJson.name}: listening on port ${PORT}`);
});
