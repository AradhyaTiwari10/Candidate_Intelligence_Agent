export type MessageRole = 'system' | 'user' | 'assistant' | 'candidate';

export interface ConversationMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: string; // ISO-8601 string
}
