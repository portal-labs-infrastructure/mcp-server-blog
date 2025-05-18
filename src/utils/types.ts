import { z } from 'zod';

export const ResourceTypes = ['forms', 'memories', 'tables', 'tools'] as const;
export type ResourceType = (typeof ResourceTypes)[number];

export const TargetEntities = ['conversations', 'agents'] as const;
export type TargetEntity = (typeof TargetEntities)[number];

export const resourceTypeSchema = z.enum(ResourceTypes);
export const targetEntitySchema = z.enum(TargetEntities);

export const EntityTypes = [
  'agents',
  'conversations',
  'forms',
  'models',
  'memories',
  'tables',
  'tools',
] as const;

export type EntityType = (typeof EntityTypes)[number];

export const entityTypeSchema = z.enum(EntityTypes);

export const Statuses = ['running', 'stopped', 'waiting', 'approve'] as const;

export type Status = (typeof Statuses)[number];

export const statusSchema = z.enum(Statuses);

export const FieldTypes = ['string', 'number', 'date', 'boolean'] as const;
export type FieldType = (typeof FieldTypes)[number];
export const fieldTypeSchema = z.enum(FieldTypes);

export interface Field {
  name: string;
  type: FieldType;
  id: string;
}

export const fieldSchema = z.object({
  name: z.string(),
  type: fieldTypeSchema,
  id: z.string(),
});
