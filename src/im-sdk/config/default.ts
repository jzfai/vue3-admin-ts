import SendPrivateImg from '@/im-sdk/widget/menuModule/SendPrivateImg.vue';
import SendPrivatePayImg from '@/im-sdk/widget/menuModule/SendPrivatePayImg.vue';
import ChatItem from '../widget/ChatItem.vue';
import ConversationItem from '../widget/ConversationItem.vue';
import ChatCallVideo from '../widget/menuModule/ChatCallVideo.vue';
import ChatCallVoice from '../widget/menuModule/ChatCallVoice.vue';
import type { Component } from 'vue';

export const ConversationItemRender = ConversationItem;

export const MessageItemRender = ChatItem;

export const ChatMenus: Component<{ id: string }>[] = [
  SendPrivateImg,
  ChatCallVoice,
  ChatCallVideo,
  // SendPrivatePayImg,
];
