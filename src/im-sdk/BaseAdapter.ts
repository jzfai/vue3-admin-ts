import MessageBuffer from "./entity/MessageBuffer";
import {
  BaseMessage,
  ConversationData,
  ImUserData,
  MessageData,
  MessageTempData,
} from "./types";

export interface LoaderListener {
  onLogin(): void;
  onMessage(message: MessageData): void;
  onConnected(): void;
  onDisconnected(): void;
}

export interface BaseAdapter {
  listener: LoaderListener;
  login(userId: string, token: string): Promise<boolean>;
  logout(): void;
  addListener(listener: LoaderListener): void;

  fetchConversations(): Promise<ConversationData[]>;
  /**需要返回从旧到新的 */
  fetchMessageList(
    userId: string,
    cursor: string
  ): Promise<{ cursor: string; list: MessageData[]; isEnd?: boolean }>;

  sendMessage(message: MessageTempData): Promise<MessageData | undefined>;

  buildConversation(base: ConversationData): ConversationData;

  fetchUser(imId: string): Promise<ImUserData>;
}
