import { Firestore } from '@google-cloud/firestore';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';

async function checkWorkspaceAccess(
  db: Firestore,
  userId: string,
  workspaceId: string,
): Promise<boolean> {
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists) return false;
  const userData = userDoc.data();
  return (
    Array.isArray(userData?.workspaces) &&
    userData.workspaces.includes(workspaceId)
  );
}

export function withWorkspaceAccess<T extends z.ZodTypeAny>(
  db: Firestore,
  inputSchema: T,
  handler: (
    args: z.infer<T>,
    req: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => Promise<CallToolResult>,
) {
  return async (
    args: z.infer<T>,
    req: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => {
    const userId = req.authInfo?.extra?.userId || ''
    if (!userId) throw new Error('No user ID found in token.');
    const hasAccess = await checkWorkspaceAccess(db, userId, args.workspace_id);
    if (!hasAccess)
      throw new Error('You do not have access to this workspace.');
    return handler(args, req);
  };
}
