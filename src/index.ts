import express from 'express';
import morgan from 'morgan';
import { mcpAuthRouter } from '@modelcontextprotocol/sdk/server/auth/router.js';
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

app.use(
  mcpAuthRouter({
    provider: proxyProvider,
    issuerUrl: new URL(OAUTH_ISSUER_URL),
    baseUrl: new URL(BASE_URL),
    serviceDocumentationUrl: new URL(DOCS_URL),
  }),
);

app.use(
  '/mcp',
  requireBearerAuth({
    provider: proxyProvider,
    requiredScopes: ['default'],
  }),
  mcpRoutes,
);

app.listen(PORT, () => {
  console.log(`${packageJson.name}: listening on port ${PORT}`);
});
