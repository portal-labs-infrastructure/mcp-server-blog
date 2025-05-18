import { Firestore } from '@google-cloud/firestore';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import { getToken } from './getToken';

async function checkWorkspaceAccess(
  db: Firestore,
  userId: string,
  workspaceId: string,
): Promise<boolean> {
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists) return false;
  const userData = userDoc.data();
  return (
    Array.isArray(userData?.organizations) &&
    userData.organizations.includes(workspaceId)
  );
}

export function withWorkspaceAccess<T extends z.ZodTypeAny>(
  db: Firestore,
  inputSchema: T,
  handler: (
    args: z.infer<T>,
    req: RequestHandlerExtra<ServerRequest, ServerNotification>,
    userId: string,
  ) => Promise<CallToolResult>,
) {
  return async (
    args: z.infer<T>,
    req: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => {
    const token = await getToken(db, req.authInfo?.token || '');
    const userId = token?.user_id;
    if (!userId) throw new Error('No user ID found in token.');
    const hasAccess = await checkWorkspaceAccess(db, userId, args.workspace_id);
    if (!hasAccess)
      throw new Error('You do not have access to this workspace.');
    return handler(args, req, userId);
  };
}
