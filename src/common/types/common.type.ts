export enum BaseStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  PRE_APPROVED = 'PRE_APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
  SUSPEND = 'SUSPEND',
}

export type Maybe<T> = T | null;

// COMMON RESPONSE
export interface MessageResponse {
  message: string;
}
