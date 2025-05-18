import { ProxyOAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/providers/proxyProvider.js';
import { OAUTH_ISSUER_URL } from '../config';
import { Firestore } from '@google-cloud/firestore';

export function createProxyProvider(db: Firestore) {
  const authorizationUrl = `${OAUTH_ISSUER_URL}/oauth/authorize`;
  const tokenUrl = `${OAUTH_ISSUER_URL}/oauth/token`;
  const revocationUrl = `${OAUTH_ISSUER_URL}/oauth/revoke`;
  const registrationUrl = `${OAUTH_ISSUER_URL}/oauth/register`;

  return new ProxyOAuthServerProvider({
    endpoints: {
      authorizationUrl,
      tokenUrl,
      revocationUrl,
      registrationUrl,
    },
    verifyAccessToken: async (token) => {
      // Use db to verify the token
      const tokenDoc = await db
        .collection('oauth_access_tokens')
        .doc(token)
        .get();
      if (!tokenDoc.exists) {
        throw new Error(`Token ${token} not found`);
      }
      const data = tokenDoc.data();
      return {
        token,
        clientId: data?.client_id,
        scopes: data?.scope,
      };
    },
    getClient: async (client_id) => {
      // Use db to get the client
      const clientDoc = await db
        .collection('oauth_clients')
        .doc(client_id)
        .get();
      if (!clientDoc.exists) {
        throw new Error(`Client ${client_id} not found`);
      }

      const data = clientDoc.data();
      return {
        client_id,
        redirect_uris: data?.redirect_uris,
      };
    },
  });
}
