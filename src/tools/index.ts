import { db } from '../services/firestoreService';
import { createGetAgentTool } from './getAgent';


export default [
  createGetAgentTool(db),
  // ...other tools
];
