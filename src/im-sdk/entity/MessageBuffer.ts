import { ChatDB } from "../db/chatDB";
import { MessageData } from "../types";

export type PipeFun = (message: MessageData) => void;
/**消息缓冲管理
 * 当远程的消息未初始化完的时候，新来的消息先到缓冲，这样可以保障消息的顺序性
 */
export default class MessageBuffer {
  private buffer: MessageData[] = [];
  private isLoaded = false;
  private pipe: PipeFun;

  private db: ChatDB;

  constructor(db: ChatDB, pipe: PipeFun) {
    this.db = db;
    this.pipe = pipe;
  }

  onReady() {
    this.isLoaded = true;
    this.buffer.forEach((message) => this.pipe(message));
    this.buffer = [];
  }

  onMessage(message: MessageData) {
    this.db.saveMessage(message);
    if (this.isLoaded) {
      this.pipe(message);
    } else {
      this.buffer.push(message);
    }
  }
}
