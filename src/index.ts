import express from 'express';
import morgan from 'morgan';
import {
  mcpAuthMetadataRouter,
} from '@modelcontextprotocol/sdk/server/auth/router.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import mcpRoutes from './routes/mcpRoutes';
import { OAUTH_ISSUER_URL, BASE_URL, DOCS_URL, PORT } from './config';
import packageJson from '../package.json';
import { verifyAccessToken } from './utils/verifyAccessToken';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Same OAuth metadata that is returned by the OAuth server
const oauthMetadata = {
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
}

app.use(
  mcpAuthMetadataRouter({
    oauthMetadata,
    resourceServerUrl: new URL(BASE_URL),
    serviceDocumentationUrl: new URL(DOCS_URL),
    scopesSupported: ['default'],
    resourceName: packageJson.name,
  }),
);

const verifier = {
  verifyAccessToken
}

app.use(
  '/mcp',
  requireBearerAuth({
    verifier,
    requiredScopes: ['default'],
    resourceMetadataUrl: new URL(OAUTH_ISSUER_URL).toString(),
  }),
  mcpRoutes,
);

app.listen(PORT, () => {
  console.log(`${packageJson.name}: listening on port ${PORT}`);
});
