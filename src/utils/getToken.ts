import { Firestore } from '@google-cloud/firestore';

export async function getToken(
  db: Firestore,
  token: string,
): Promise<{ workspace_id: string; user_id: string } | null> {
  const tokenDoc = await db.collection('oauth_access_tokens').doc(token).get();
  if (!tokenDoc.exists) return null;
  const data = tokenDoc.data();
  console.log('getToken', token, data);
  return {
    workspace_id: data?.workspace_id,
    user_id: data?.user_id,
  };
}
