import { Firestore } from '@google-cloud/firestore';
import { z } from 'zod';
import { withWorkspaceAccess } from '../utils/withWorkspaceAccess';

export const getAgentInputSchema = z.object({
  workspace_id: z.string(),
  agent_id: z.string(),
});

export const getAgentOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  created_at: z.any(),
  updated_at: z.any(),
});

export function createGetAgentTool(db: Firestore) {
  return {
    name: 'get_agent',
    description: 'Get the details of a agent by its ID.',
    inputSchema: getAgentInputSchema,
    handler: withWorkspaceAccess(db, getAgentInputSchema, async (args) => {
      const agentRef = db
        .collection('workspaces')
        .doc(args.workspace_id)
        .collection('agents')
        .doc(args.agent_id);
      const agentSnap = await agentRef.get();
      if (!agentSnap.exists) {
        throw new Error(`Agent ${args.agent_id} does not exist.`);
      }

      const agentData = agentSnap.data()!;
      const output = getAgentOutputSchema.parse({
        id: agentData.id,
        title: agentData.title,
        description: agentData.description,
        created_at: agentData.created_at.toDate(),
        updated_at: agentData.updated_at.toDate(),
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
