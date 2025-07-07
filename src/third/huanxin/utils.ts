import {
  CallAction,
  CallMessage,
  CallResult,
  CallType,
  MessageCommon,
  MessageData,
  MessageState,
} from '@/im-sdk/types';
import { EasemobChat } from 'easemob-websdk';

export function messageConvert(
  message: EasemobChat.MessagesType,
  selfId: string
): MessageData | undefined {
  // todo 目前只处理了单个的聊天
  const base: MessageCommon = {
    target: message.to === selfId ? message.from! : message.to,
    id: message.id,
    from: message.from,
    to: message.to,
    time: 0,
    isRead: false,
    state: MessageState.sending,
  };
  if (message.type === 'txt') {
    return {
      ...base,
      type: 'txt',
      msg: message.msg,
      ext: message.ext,
      isRead: !!message.isRead,
      time: message.time,
      state: MessageState.sended,
    };
  } else if (message.type === 'img') {
    return {
      ...base,
      type: 'img',
      url: message.url,
      width: message.width || 0,
      height: message.height || 0,
      length: message.file_length || 0,
      ext: message.ext,
      isRead: !!message.isRead,
      time: message.time,
      state: MessageState.sended,
    };
  } else if (message.type === 'audio') {
    return {
      ...base,
      type: 'audio',
      url: message.url,
      duration: message.length || 0,
      length: message.file_length || 0,
      ext: message.ext,
      isRead: !!message.isRead,
      time: message.time,
      state: MessageState.sended,
    };
  } else if (message.type === 'video') {
    return {
      ...base,
      type: 'video',
      url: message.url,
      width: message.ext?.width || 0,
      height: message.ext?.height || 0,
      duration: message.length || 0,
      length: message.file_length || 0,
      ext: message.ext,
      isRead: !!message.isRead,
      time: message.time,
      state: MessageState.sended,
    };
  } else if (message.type === 'read') {
    return {
      ...base,
      type: 'read',
      messageId: message.mid!,
    };
  } else if (message.type === 'channel') {
    return {
      ...base,
      type: 'clearUnread',
      time: message.time,
    };
  }
}
export interface CallDataExt {
  callId: string;
  action: CallAction;
  type: CallType;
  channel?: string;
  start?: number;
  end?: number;
  result: CallResult;
}
export const CmdCallMessageAction = 'rtcCall';

export function callDataConvert(
  message: EasemobChat.CmdMsgBody,
  selfId: string
): CallMessage | undefined {
  if (message.action !== CmdCallMessageAction) {
    return;
  }
  const ext = message.ext as CallDataExt;
  const base: MessageCommon = {
    target: message.to === selfId ? message.from! : message.to,
    id: message.id,
    from: message.from,
    to: message.to,
    time: Date.now(),
    isRead: false,
    state: MessageState.sending,
  };
  return {
    ...base,
    type: 'call',
    callId: ext.callId,
    callType: ext.type,
    result: ext.result,
    channel: ext.channel,
    start: ext.start,
    end: ext.end,
  };
}
