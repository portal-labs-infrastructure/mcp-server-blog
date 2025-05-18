import { Firestore } from '@google-cloud/firestore';
import { z } from 'zod';
import { withWorkspaceAccess } from '../utils/withWorkspaceAccess';

export const getUserInputSchema = z.object({
  workspace_id: z.string(),
  user_id: z.string(),
});

export const getUserOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  created_at: z.any(),
  updated_at: z.any(),
});

export function createGetUserTool(db: Firestore) {
  return {
    name: 'get_user',
    description: 'Get the details of a user by its ID.',
    inputSchema: getUserInputSchema,
    handler: withWorkspaceAccess(db, getUserInputSchema, async (args) => {
      const userRef = db
        .collection('workspaces')
        .doc(args.workspace_id)
        .collection('users')
        .doc(args.user_id);
      const userSnap = await userRef.get();
      if (!userSnap.exists) {
        throw new Error(`User ${args.user_id} does not exist.`);
      }

      const userData = userSnap.data()!;
      const output = getUserOutputSchema.parse({
        id: userData.id,
        title: userData.title,
        description: userData.description,
        created_at: userData.created_at.toDate(),
        updated_at: userData.updated_at.toDate(),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    }),
  };
}
