import { $t } from "@/locales";
import message from "@/utils/message";
import BenzAMRRecorder from "benz-amr-recorder";

interface VoiceRecord {
  blob: Blob | null;
  duration: number;
}

export class VioceRecorder {
  /**定时器 */
  private timer?: NodeJS.Timeout;

  time = 0;

  private recorder = new BenzAMRRecorder();

  private maxDuration = 0;

  private onEmit?: (data: VoiceRecord) => void;
  private onProgress?: (duration: number) => void;

  /**是否进入录制中 */
  private isEnterRecord = false;

  constructor(maxDuration: number, onProgress?: (duration: number) => void) {
    this.maxDuration = maxDuration;
    this.onProgress = onProgress;
  }

  start(onEmit: (data: VoiceRecord) => void) {
    this.onEmit = onEmit;
    return this.recorder
      .initWithRecord()
      .then(() => {
        this.recorder.startRecord();
        this.time = Date.now();
        this.isEnterRecord = true;
        this.timer = setInterval(this.update, 100);
        return true;
      })
      .catch((e) => {
        message.error($t("common.recordError"));
        return false;
      });
  }

  abort() {
    if (this.recorder.isRecording()) {
      this.recorder.cancelRecord();
    }
    this.onEmit = undefined;
  }

  async finish() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    if (!this.isEnterRecord) {
      return;
    }
    try {
      if (this.recorder.isRecording()) {
        await this.recorder.finishRecord();
      }
      const blob = this.recorder.getBlob();
      this.onEmit?.({
        blob,
        duration: this.recorder.getDuration(),
      });
    } catch (error) {
      message.error($t("common.recordErrornot"));
    }
  }

  update = () => {
    const dt = Date.now() - this.time;
    if (dt >= this.maxDuration) {
      this.recorder.finishRecord();
      message.error("已达到最大录制时间");
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.onProgress?.(dt);
  };
}
