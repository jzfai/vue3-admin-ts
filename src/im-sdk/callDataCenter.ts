import { reactive } from 'vue';
import ImDataCenter from './ImDataCenter';
import errorManager, { ImErrorCode } from './manager/errorManager';
import {
  CallAction,
  CallMessage,
  CallState,
  CallType,
  ImUserData,
  MessageData,
  MessageState,
} from './types';
import { doWhile } from './utils';

/** 
                                ** 呼叫流程 **
    caller            -------------------------------------->          callee
            ----------callout--------------->响铃
                                        <-------------busy-------
                                        <-------------refuse-------
                                        <-------------accept(创建房间并进入)-------
             ----------确定进入房间onEnter，计时--------------->
*/

export interface CallListener {
  onLogin(): void;
  onCall: (data: CallMessage) => void;
  onCancel: (data: CallMessage) => void;
  /**被对方接受 */
  onAccepted: (data: CallMessage) => void;
  /**被对方拒绝 */
  onRefused: (data: CallMessage) => void;
  /**对方忙碌 */
  onBusy: (data: CallMessage) => void;
  /**完成通话 */
  onFinished: (data: CallMessage) => void;
  onEnter: (data: CallMessage) => void;
  /**视频链接超时 */
  onTimeout: (data: CallMessage) => void;
  /**视频转语音 */
  onVideo2Vioce: (data: CallMessage) => void;
  /**异常中止，用于修复状态 */
  onAbort: (data: CallMessage) => void;
}
export interface CallAdapter {
  callListener: CallListener;
  login(userId: string, token: string): Promise<boolean>;
  logout(): void;
  /**回应对方 */
  react(
    data: CallMessage,
    action: CallAction
  ): Promise<{ id: string; success: boolean }>;
  addCallListener(listener: CallListener): void;
  getChannel(): Promise<string>;
  joinChannel(channel: string, callType: CallType): Promise<boolean>;
  exitChannel(): void;
  fetchUser(imId: string): Promise<ImUserData>;
}

interface CallData {
  state: CallState;
  isCallOut: boolean;
  /**聊天类型 */
  type: CallType;
  mine?: ImUserData;
  target?: ImUserData;
}
class CallDataCenter implements CallListener {
  private adapter!: CallAdapter;
  private isLogin = false;

  userId!: string;
  token!: string;

  /**是不是群聊 */
  isGroup = false;
  /**目标用户，如果是群的话，就是聊id */
  target?: string;
  /**房间成员 */
  users: string[] = [];
  /**响铃的时间 */
  ringTime = 0;

  message?: CallMessage;

  data: CallData = reactive({
    state: CallState.idle,
    isCallOut: false,
    type: 'video',
  });

  /**电话等待时间 */
  static ringTime = 30000;
  /**视频语音流等待时间 */
  static streamWaitTime = 10000;

  /**定时器 */
  private timer?: NodeJS.Timeout;

  /**计时判断对方是否进入视频流，如果没有进入则主动关闭 */
  private streamTimer?: NodeJS.Timeout;
  /**等待对方流的接入 */
  waitSteam = false;

  constructor() {}

  login(userId: string, token: string) {
    this.userId = userId;
    this.token = token;
    this.init();
    this.adapter.login(userId, token);
    this.isLogin = true;
    this.adapter.fetchUser(this.userId).then((resp) => {
      this.data.mine = resp;
    });
  }
  async logout() {
    if (this.data.state === CallState.calling) {
      if (this.message) {
        this.sendMessage(this.message, CallAction.cancel);
      }
    } else if (this.data.state === CallState.alerting) {
      if (this.message) {
        this.sendMessage(this.message, CallAction.refuse);
      }
    } else if (this.data.state === CallState.talking) {
      if (this.message) {
        this.sendMessage(this.message, CallAction.finish);
      }
    }
    this.adapter.logout();
    this.isLogin = false;
    this.reset();
  }
  onLogin() {
    if (!this.message) return;
    this.target = this.message.target;
    this.data.type = this.message.callType;
    this.adapter.fetchUser(this.message.target).then((resp) => {
      this.data.target = resp;
    });

    if (this.message.result === 'calling') {
      this.data.state = CallState.calling;
      this.data.isCallOut = true;
      this.ringTime = this.message.time;
      const leftTime = CallDataCenter.ringTime - (Date.now() - this.ringTime);
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.cancel();
      }, leftTime);
    } else if (this.message.result === 'ring') {
      this.data.state = CallState.alerting;
      this.data.isCallOut = false;
      this.ringTime = this.message.time;
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.refuse();
      }, CallDataCenter.ringTime - (Date.now() - this.ringTime));
    } else if (
      this.message.result === 'success' ||
      this.message.result === 'wait'
    ) {
      this.data.state = CallState.talking;
      const channel = this.message.channel;
      if (channel) {
        this.adapter
          .joinChannel(channel, this.message.callType)
          .then((success) => {
            if (!success) {
              // 通知恢复通话失败，自动中止
              errorManager.emit({
                code: ImErrorCode.resumeCallFailed,
                data: {
                  state: CallState.alerting,
                  target: this.target,
                  message: this.message,
                },
              });
              this.finish();
            }
          });
      } else {
        this.finish();
      }
    } else {
      this.reset();
    }
  }

  async init() {
    // 查询上一次通话信息，重建通话状态
    const lastCallMessage = this.readTemp();
    if (lastCallMessage) {
      if (
        ['busy', 'cancel', 'failed', 'finish', 'refuse'].includes(
          lastCallMessage.result
        )
      ) {
        return;
      }
      this.message = lastCallMessage;
    }
  }

  setAdapter(adapter: CallAdapter) {
    this.adapter = adapter;
    this.adapter.addCallListener(this);
  }
  private reset() {
    this.clearWaitTimer();
    if (this.streamTimer) {
      clearTimeout(this.streamTimer);
    }
    this.streamTimer = undefined;
    this.target = undefined;
    this.data.state = CallState.idle;
    this.message = undefined;
    this.saveTemp();
  }
  /**呼叫对方 */
  async call(target: string, type: CallType) {
    if (this.data.state !== CallState.idle) {
      // 不是空闲状态不应该呼叫对方
      return;
    }
    this.data.type = type;
    this.data.isCallOut = true;
    const message: MessageData = {
      id: '',
      target,
      from: this.userId,
      to: target,
      time: Date.now(),
      isRead: false,
      state: MessageState.sending,
      type: 'call',
      result: 'calling',
      callId: '',
      callType: type,
      start: Date.now(),
    };
    this.message = message;
    this.target = target;

    this.adapter.fetchUser(this.message.target).then((resp) => {
      this.data.target = resp;
    });
    // 暂时不要这个了，不然会看见正在呼叫中的消息不好删除
    // ImDataCenter.onMessage({ ...message });
    const ret = await this.sendMessage(message, CallAction.callout);
    if (ret.success) {
      this.data.state = CallState.calling;
      message.id = ret.id;
      message.state = MessageState.sending;
      message.callId = ret.id;
      ImDataCenter.onMessage({ ...message });
      this.saveTemp();
      this.ringTime = Date.now();
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.cancel();
      }, CallDataCenter.ringTime);
    } else {
      this.reset();
    }
  }
  private clearWaitTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
  /**取消请求 */
  async cancel() {
    // 兼容一下，如果点取消的同时，收到确定，就直接到完成
    if (this.data.state === CallState.talking) {
      return this.finish();
    }
    if (this.data.state !== CallState.calling) {
      // 不是响铃状态不应该取消呼叫
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) return;
    if (message.type === 'call') {
      message.result = 'cancel';
      message.time = Date.now();
      ImDataCenter.onMessage({ ...message });
    }
    this.reset();
    // 重试直到超时
    doWhile(async () => {
      if (!this.isLogin) return true;
      if (Date.now() - this.ringTime > CallDataCenter.ringTime) {
        return true;
      }
      return (await this.sendMessage(message, CallAction.cancel)).success;
    }, 1000);
  }
  /**接受对方 */
  async accept() {
    const target = this.target;
    const message = this.message;
    if (!target || !message) return;
    // 考虑时间，比如在waitime提前一点，不然另外边可能认为已经挂了
    if (this.data.state === CallState.alerting) {
      const channel = await this.adapter.getChannel();
      if (!channel) {
        // 抛出事件，获取房间号失败，请重试
        errorManager.emit({ code: ImErrorCode.getRoomIdFailed });
        message.result = 'abort';
        ImDataCenter.onMessage({ ...message });
        this.sendMessage(message, CallAction.abort);
        this.adapter.exitChannel();
        return;
      }
      const success = await this.adapter.joinChannel(channel, message.callType);
      if (!success) {
        // 抛出事件，进入房间失败失败，请重试
        errorManager.emit({
          code: ImErrorCode.enterRoomFailed,
          data: { channel, callType: message.callType },
        });
        message.result = 'abort';
        ImDataCenter.onMessage({ ...message });
        this.sendMessage(message, CallAction.abort);
        this.adapter.exitChannel();
        this.reset();
        return;
      }
      if (this.data.state !== CallState.alerting) {
        // 加入房间的途中，被对方cancel了
        this.adapter.exitChannel();
        this.reset();
        return;
      }
      this.data.state = CallState.talking;
      message.result = 'wait';
      message.time = Date.now();
      message.channel = channel;
      ImDataCenter.onMessage({ ...message });
      this.saveTemp();
      this.clearWaitTimer();
      // 重试直到超时
      await doWhile(async () => {
        if (this.data.state !== CallState.talking) return true;
        return (await this.sendMessage(message, CallAction.accept)).success;
      }, 1000);
      this.waitSteam = true;
      this.streamTimer = setTimeout(() => {
        this.streamTimer = undefined;
        this.timeout();
      }, CallDataCenter.streamWaitTime);
    } else {
      // 没有在响铃中，不应该触发主动调用拒绝
    }
  }
  /**拒绝对方 */
  async refuse() {
    if (this.data.state === CallState.alerting) {
      const target = this.target;
      const message = this.message;
      if (!target || !message) {
        errorManager.emit({
          code: ImErrorCode.callDataException,
          data: {
            state: CallState.alerting,
            action: 'refuse',
            target,
            message,
          },
        });
        return;
      }
      this.data.state = CallState.idle;
      if (message.type === 'call') {
        message.result = 'refuse';
        message.time = Date.now();
        ImDataCenter.onMessage({ ...message });
      }
      const time = this.ringTime;
      this.reset();
      // 重试直到超时
      await doWhile(async () => {
        if (!this.isLogin) return true;
        if (Date.now() - time > CallDataCenter.ringTime) {
          return true;
        }
        return (await this.sendMessage(message, CallAction.refuse)).success;
      }, 1000);
    } else {
      // 没有在响铃中，不应该触发主动调用拒绝
    }
  }
  /**进入房间超时 */
  async timeout() {
    if (this.data.state !== CallState.talking) {
      // 都没有进入通话，不应该有超时
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: { state: CallState.talking, action: 'timeout', target, message },
      });
      return;
    }
    message.result = 'failed';
    message.time = Date.now();
    message.end = Date.now();
    ImDataCenter.onMessage({ ...message });
    this.adapter.exitChannel();
    this.reset();
    await doWhile(async () => {
      if (!this.isLogin) return true;
      if (this.data.state !== CallState.idle) return true;
      return (await this.sendMessage(message, CallAction.timeout)).success;
    }, 1000);
  }
  /**结束通话 */
  async finish() {
    if (this.data.state !== CallState.talking) {
      // 都没有进入通话，不应该有结束的
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: { state: CallState.talking, action: 'finish', target, message },
      });
      return;
    }
    message.result = 'finish';
    message.time = Date.now();
    this.reset();
    message.end = Date.now();
    ImDataCenter.onMessage({ ...message });
    this.adapter.exitChannel();
    await doWhile(async () => {
      if (!this.isLogin) return true;
      if (this.data.state !== CallState.idle) return true;
      return (await this.sendMessage(message, CallAction.finish)).success;
    }, 1000);
  }
  /**视频转语音通话 */
  async video2voice() {
    if (this.data.state !== CallState.talking) {
      // 都没有进入通话，不应该有视频切换
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: {
          state: CallState.talking,
          action: 'video2voice',
          target,
          message,
        },
      });
      return;
    }
    this.sendMessage(message, CallAction.video2vioce);
  }
  // 以下为潍坊给的事件
  /**收到呼叫 */
  async onCall(data: CallMessage) {
    const message: CallMessage = {
      id: data.id,
      target: data.from!,
      from: data.from!,
      to: this.userId,
      time: Date.now(),
      isRead: false,
      state: MessageState.sended,
      type: 'call',
      result: 'ring',
      callType: data.callType,
      callId: data.id,
    };
    this.data.type = data.callType;
    if (this.data.state === CallState.idle) {
      this.target = data.target;
      this.data.isCallOut = false;
      this.ringTime = data.time;
      this.data.state = CallState.alerting;
      this.message = message;
      ImDataCenter.onMessage({ ...message });
      this.saveTemp();
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.refuse(); // todo 先暂时用拒绝，应该是无人应答才对
      }, CallDataCenter.ringTime - (Date.now() - data.time));
      this.adapter.fetchUser(this.message.target).then((resp) => {
        this.data.target = resp;
      });
    } else if (this.target !== data.target) {
      await doWhile(async () => {
        if (!this.isLogin) return true;
        return (await this.sendMessage(message, CallAction.busy)).success;
      }, 1000);
    } else {
      // 说明是同一个人呢发过来的多次呼叫，忽略
    }
  }
  /**发起方取消 */
  async onCancel(data: CallMessage) {
    this.checkAbort(data);
    if (this.data.state !== CallState.alerting) {
      // 说明刚刚发起方已经取消了，或者超时了
      return;
    }
    if (data.from !== this.target) {
      // 防御性代码
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: { state: CallState.calling, action: 'onCancel', target, message },
      });
      return;
    }
    message.result = 'cancel';
    message.time = Date.now();
    ImDataCenter.onMessage({ ...message });
    this.reset();
    await doWhile(async () => {
      if (!this.isLogin) return true;
      return (await this.sendMessage(message, CallAction.cancel)).success;
    }, 1000);
  }
  /**被对方接受 */
  async onAccepted(data: CallMessage) {
    this.checkAbort(data);
    if (this.data.state !== CallState.calling) {
      // 说明刚刚发起方已经取消了，或者超时了
      return;
    }
    if (data.from !== this.target) {
      // 防御性代码
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: {
          state: CallState.calling,
          action: 'onAccepted',
          target,
          message,
        },
      });
      return;
    }
    message.channel = data.channel;
    if (!message.channel) {
      // 抛出异常，通道异常不存在
      errorManager.emit({
        code: ImErrorCode.roomIdNotFound,
        data: { state: CallState.calling, target, message },
      });
      return;
    }
    this.clearWaitTimer();
    const success = await this.adapter.joinChannel(
      message.channel,
      message.callType
    );
    if (!success) {
      // 抛出事件，进入房间失败失败，请重试
      errorManager.emit({
        code: ImErrorCode.joinRoomFailed,
        data: { state: CallState.calling, target, message },
      });
      message.result = 'abort';
      ImDataCenter.onMessage({ ...message });
      this.sendMessage(message, CallAction.abort);
      this.adapter.exitChannel();
      this.reset();
      return;
    }
    if (this.data.state !== CallState.calling) {
      // 加入房间的间隙中，被取消了
      this.adapter.exitChannel();
      this.reset();
      return;
    }
    message.result = 'success';
    message.time = Date.now();
    message.start = Date.now();
    this.data.state = CallState.talking;
    ImDataCenter.onMessage({ ...message });
    this.saveTemp();
    await doWhile(async () => {
      if (!this.isLogin) return true;
      return (await this.sendMessage(message, CallAction.enter)).success;
    }, 1000);
  }
  /**被对方拒绝 */
  onRefused(data: CallMessage) {
    this.checkAbort(data);
    if (this.data.state !== CallState.calling) {
      // 说明刚刚发起方已经取消了，或者超时了
      return;
    }
    if (data.from !== this.target) {
      // 防御性代码
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: {
          state: CallState.calling,
          action: 'onRefused',
          target,
          message,
        },
      });
      return;
    }
    message.result = 'refuse';
    message.time = Date.now();
    ImDataCenter.onMessage({ ...message });
    this.reset();
  }
  /**被对方拒绝 */
  onBusy(data: CallMessage) {
    this.checkAbort(data);
    if (this.data.state !== CallState.calling) {
      // 说明刚刚发起方已经取消了，或者超时了
      return;
    }
    if (data.from !== this.target) {
      // 防御性代码
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: { state: CallState.calling, action: 'onBusy', target, message },
      });
      return;
    }
    message.result = 'busy';
    message.time = Date.now();
    ImDataCenter.onMessage({ ...message });
    this.reset();
  }
  /**完成通话 */
  onFinished(data: CallMessage) {
    this.checkAbort(data);
    if (this.data.state !== CallState.talking) {
      // 说明我可能主动关闭了
      return;
    }
    if (data.from !== this.target) {
      // 防御性代码
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: {
          state: CallState.talking,
          action: 'onFinished',
          target,
          message,
        },
      });
      return;
    }
    message.end = data.end;
    message.result = 'finish';
    message.time = Date.now();
    ImDataCenter.onMessage({ ...message });
    this.adapter.exitChannel();
    this.reset();
  }

  onEnter(data: CallMessage) {
    this.checkAbort(data);
    if (this.data.state !== CallState.talking) {
      // 如果不是会话状态
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: { state: CallState.talking, action: 'onEnter', target, message },
      });
      return;
    }
    if (data.from === this.target) {
      this.waitSteam = false;
      clearTimeout(this.streamTimer);
      this.streamTimer = undefined;

      message.start = data.start;
      message.result = 'success';
      message.time = Date.now();
      ImDataCenter.onMessage({ ...message });
      this.saveTemp();
    }
  }
  onTimeout(data: CallMessage) {
    if (this.data.state !== CallState.talking) {
      // 如果不是会话状态

      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: {
          state: CallState.talking,
          action: 'onTimeout',
          target,
          message,
        },
      });
      return;
    }
    this.adapter.exitChannel();
    if (data.from === this.target) {
      this.waitSteam = false;
      clearTimeout(this.streamTimer);
      this.streamTimer = undefined;

      message.result = 'failed';
      message.time = Date.now();
      ImDataCenter.onMessage({ ...message });
      this.reset();
    }
  }
  onAbort(data: CallMessage) {
    if (this.data.state !== CallState.idle) {
      // 直接终止
      const message = this.message;
      if (message) {
        // 说明可能是其他的历史消息来的
        if (data.target !== message.target) return;
        message.result = 'abort';
        ImDataCenter.onMessage({ ...message });
      }
      this.reset();
      this.adapter.exitChannel();
    }
  }
  onVideo2Vioce(data: CallMessage) {
    if (this.data.state !== CallState.talking) {
      // 如果不是会话状态
      return;
    }
    const target = this.target;
    const message = this.message;
    if (!target || !message) {
      errorManager.emit({
        code: ImErrorCode.callDataException,
        data: {
          state: CallState.talking,
          action: 'onVideo2Vioce',
          target,
          message,
        },
      });
      return;
    }
    if (data.from === this.target) {
      this.data.type = 'audio';
    }
  }

  private sendMessage(message: CallMessage, action: CallAction) {
    // 需要在这里调个头，原因是本地的消息要保持说明是谁给谁打的，但是发送出去的消息是我发给对面
    return this.adapter.react(
      { ...message, from: this.userId, to: message.target! },
      action
    );
  }

  private checkAbort(data: CallMessage) {
    if (data.from !== this.target) {
      data.result = "abort"
      this.sendMessage(data, CallAction.abort);
    }
  }

  private saveTemp() {
    if (this.message) {
      localStorage.setItem(
        `CALL-MESSAGE:${this.userId}`,
        JSON.stringify(this.message)
      );
    } else {
      localStorage.removeItem(`CALL-MESSAGE:${this.userId}`);
    }
  }
  private readTemp() {
    const str = localStorage.getItem(`CALL-MESSAGE:${this.userId}`);
    if (str) {
      try {
        return JSON.parse(str) as CallMessage;
      } catch (error) {
        // 忽略
      }
    }
  }
}
/**视频语音通话的数据管理 */
export default new CallDataCenter();
