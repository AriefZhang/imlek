export enum BaseStatus {
  SOLD_OUT = 'SOLD_OUT',
  AVAILABLE = 'AVAILABLE',
}

export type Maybe<T> = T | null;

// COMMON RESPONSE
export interface MessageResponse {
  message: string;
}
