import { Router } from 'express';
import {
  handleMcpPost,
  handleMcpMethodNotAllowed,
} from '../controllers/mcpController';

const router = Router();

// This setup is for stateless sessionless MCP requests.
// https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#without-session-management-stateless

router.post('/', handleMcpPost);
router.get('/', handleMcpMethodNotAllowed);
router.delete('/', handleMcpMethodNotAllowed);

export default router;
