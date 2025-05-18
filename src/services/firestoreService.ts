import { Firestore } from '@google-cloud/firestore';
import { PROJECT_ID } from '../config';

export const db = new Firestore({
  projectId: PROJECT_ID,
});
