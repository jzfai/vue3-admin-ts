export interface ImEventData {
  code: number;
  data?: any;
  error?: any;
}
type EventHandler = (data: ImEventData) => void;

export enum ImErrorCode {
  /**加载远程会话信息失败 */
  loadRemoteConversationError = 1,
  /**加载远程聊天信息失败 */
  loadRemoteMessageError,
  /**发送消息错误 */
  sendMessageError,
  /**发送消息失败 */
  sendMessageFailed,
  /**音视频聊天获取房间号失败 */
  getRoomIdFailed,
  /**进入房间失败 */
  enterRoomFailed,
  /**通话数据异常 */
  callDataException,
  /**room不存在，在收到对方同意进入房间，但是对方没有生成房间id */
  roomIdNotFound,
  /**加入房间失败 */
  joinRoomFailed,
  /**恢复通话失败 */
  resumeCallFailed,
}

class ImErrorEmitter {
  private events: Set<EventHandler>;

  constructor() {
    this.events = new Set();
  }

  // 订阅事件
  on(handler: EventHandler): void {
    this.events.add(handler);
  }

  // 取消订阅事件
  off(handler: EventHandler): void {
    this.events.delete(handler);
  }

  // 触发事件
  emit(data: ImEventData): void {
    const handlersCopy = Array.from(this.events);
    for (const handler of handlersCopy) {
      try {
        handler(data);
      } catch (error) {
        console.log('执行im的监听时间异常', error);
      }
    }
  }
}

export default new ImErrorEmitter();
