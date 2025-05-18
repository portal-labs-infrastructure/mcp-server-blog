import { Firestore } from '@google-cloud/firestore';

/**
 * Fetch a list of resources by IDs, returning only specified fields.
 * @param db Firestore instance
 * @param workspaceId The organization/workspace ID
 * @param collection The collection name (e.g. "tables", "memories", etc)
 * @param ids Array of document IDs to fetch
 * @param fields Array of field names to include in the result
 * @returns Array of objects, each containing only the requested fields
 */
export async function fetchResourceList(
  db: Firestore,
  workspaceId: string,
  collection: string,
  ids: string[],
  fields: string[],
): Promise<Array<Record<string, any>>> {
  const results: Array<Record<string, any>> = [];
  for (const id of ids || []) {
    const ref = db
      .collection('organizations')
      .doc(workspaceId)
      .collection(collection)
      .doc(id);
    const docSnap = await ref.get();
    if (docSnap.exists) {
      const data = docSnap.data()!;
      // Only include specified fields
      const filtered: Record<string, any> = {};
      for (const k of fields) {
        filtered[k] = data[k];
      }
      results.push(filtered);
    }
  }
  return results;
}
