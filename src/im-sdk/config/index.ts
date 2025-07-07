/**im的配置 */

import type { Component } from 'vue';
import {
  ConversationData,
  ImUserData,
  MessageData,
  MessageTempData,
} from '../types';

export type MessageRenderType = Pick<MessageData, 'type'>['type'];

export enum HooksKey {}
class ImConfig {
  /**聊天时候的菜单 */
  chatMenus: Component<{ id: string }>[] = [];

  conversationRender?: Component<{ data: ConversationData }>;

  messageItemRender?: Component<{ data: MessageData }>;

  /**进入与谁的聊天 */
  onChatWith?: (user?: string) => void;
  /**查看某人资料 */
  onViewUser?: (user?: ImUserData) => void;
  /**发送消息前校验，如果返回false，则中止发送 */
  onBeforeSendMessage?: (m: MessageTempData) => Promise<boolean>;
  onAfterSendMessage?: (m: MessageData) => void;

  /**会话列表加载完成，可以用来做预加载聊天的代码 */
  onLoadConversationView?: () => void;
}

export default new ImConfig();
