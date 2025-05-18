import { Router } from 'express';
import {
  handleMcpPost,
  handleMcpMethodNotAllowed,
} from '../controllers/mcpController';

const router = Router();

router.post('/', handleMcpPost);
router.get('/', handleMcpMethodNotAllowed);
router.delete('/', handleMcpMethodNotAllowed);

export default router;
