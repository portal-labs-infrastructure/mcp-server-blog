import { db } from '../services/firestoreService';

export const verifyAccessToken = async (token: string) => {
  // Example using db to verify the token
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
    // Include any extra data you want to use in the tool handlers
    extra: {
      userId: data?.user_id,
    }
  };
}
