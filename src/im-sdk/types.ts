export type MsgType =
  | 'txt'
  | 'img'
  | 'audio'
  | 'video'
  | 'file'
  | 'loc'
  | 'delivery'
  | 'read'
  | 'custom'
  | 'call';

export type ConversationType = 'singleChat' | 'groupChat';

export enum MessageState {
  sending = 0,
  sended,
  failed,
  read,
}

export interface MessageBrief {
  /**消息id */
  id: string;
  /**缩略信息，用于会话列表展示 */
  brief: string;
  /**发送者 */
  sender?: string;
}
export interface ConversationData {
  /**聊天对象，用户id或者群id */
  id: string;
  type: ConversationType;
  /**置顶 */
  isPinned: boolean;
  unReadCount: number;
  last?: MessageBrief;
  time: number;
  /**拓展的自定义数据 */
  ext?: Record<string, any>;
  user?: ImUserData;
}
export interface BaseMessage {
  /**聊天对象 */
  target: string;
  /**如果target===to，说明是我发给对方 */
  to: string;
  time: number;
  isRead: boolean;
  state: MessageState;
}
export interface TxtContent {
  type: 'txt';
  msg: string;
}
export interface ImgContent {
  type: 'img';
  url?: string;
  width: number;
  height: number;
  length: number;
}
export interface AudioContent {
  type: 'audio';
  url?: string;
  /**时长 */
  duration: number;
  /**文件大小 */
  length: number;
}
export interface VideoContent {
  type: 'video';
  url?: string;
  width: number;
  height: number;
  /**时长 */
  duration: number;
  /**文件大小 */
  length: number;
}
interface ReadContent {
  type: 'read';
  messageId: string;
}
export type CallResult =
  | 'calling'
  | 'ring'
  | 'cancel'
  | 'refuse'
  | 'busy'
  | 'wait'
  | 'success'
  | 'finish'
  | 'abort' //异常中止，往往是为了修复状态
  | 'failed'; // 通话失败，往往是超时没有进入房间
export type CallType = 'audio' | 'video';
export interface CallContent {
  type: 'call';
  /**通话id，多个通话消息共用同一个消息id，方便更新 */
  callId: string;
  result: CallResult;
  callType: CallType;
  /**通话通道，进入的房间 */
  channel?: string;
  /**通话开始时间 */
  start?: number;
  /**通话结束时间 */
  end?: number;
}
export interface ClearUnreadContent {
  type: 'clearUnread';
}
export type MessageContent =
  | TxtContent
  | ImgContent
  | AudioContent
  | VideoContent
  | ReadContent
  | CallContent
  | ClearUnreadContent;
export interface MessageCommon {
  id: string;
  /**聊天对象，对应的是会话id */
  target: string;
  /**如果是群聊，则会有这个字段 */
  from?: string;
  /**如果target===to，说明是我发给对方 */
  to: string;
  time: number;
  /**我是否读取过 */
  isRead: boolean;
  state: MessageState;
  ext?: Record<string, any>;
  /**回复的消息id */
  replay?: string;
}
export type MessageData = MessageCommon & MessageContent;
export type ReadMessage = MessageCommon & ReadContent;
export type ClearUnreadMessage = MessageCommon & ClearUnreadContent;

export interface MessageTempData {
  message: MessageData;
  blob?: Blob;
}

/**用户系统，要做用户的头像URL.create */
export interface ImUserData {
  /**im的用户id */
  imId: string;
  /**原本系统的用户id */
  userId: string;
  name: string;
  avatar: string;
  /**不要存太多拓展的了，会存数据库 */
  [key: string]: any;
}

export enum CallState {
  /**闲置 */
  idle = 0,
  /**请求中 */
  calling,
  /**响铃 */
  alerting,
  /**通话中 */
  talking,
}

export enum CallAction {
  /**对外呼叫 */
  callout = 0,
  /**取消呼叫 */
  cancel,
  /**接受 */
  accept,
  /**拒绝 */
  refuse,
  /**忙碌 */
  busy,
  /**进入房间 */
  enter,
  /**进入房间超时 */
  timeout,
  /**通话完成 */
  finish,
  /**异常终止，用来修复交互状态 */
  abort,
  /**视频转语音 */
  video2vioce,
}
export type CallMessage = MessageCommon & CallContent;
