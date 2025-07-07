<template>
  <div>
    <button
      class="record-btn"
      @touchstart.prevent="startRecording"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="endRecording"
    >
      {{ innerData.text }}
    </button>
    <van-overlay
      :show="innerData.isRecording"
      @click="innerData.isRecording = false"
      :custom-style="{ background: 'rgba(0, 0, 0, 0)' }"
    >
      <div class="wrapper">
        <div class="status_box">
          <div class="left" ref="cancelZone">
            <div class="status_text" :class="{ active: innerData.state === 0 }">
              {{ $t("imSdk.ReleaseCancel") }}
            </div>
            <img
              :src="innerData.state === 0 ? cancelImg : cancelBtnImg"
              alt="imgBtn"
            />
          </div>
          <div class="status_text" :class="{ active: innerData.state === 1 }">
            {{ $t("imSdk.ReleaseSend") }}
          </div>
          <div class="right" ref="sendZone">
            <div class="status_text" :class="{ active: innerData.state === 2 }">
              {{ $t("imSdk.ReleaseSend") }}
            </div>
            <img
              :src="innerData.state === 2 ? sendVBtnImg : sendVImg"
              alt="imgBtn"
            />
          </div>
        </div>
        <div
          class="voice_box"
          :style="{
            backgroundColor: innerData.state === 0 ? '#F44649' : '#4c72f6',
          }"
        >
          <div class="audio_bars">
            <div
              v-for="i in 60"
              :key="i"
              class="bar"
              :style="{ animationDelay: `${(i - 1) * 1}s` }"
            ></div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script lang="ts" setup>
import cancelImg from "@/im-sdk/assets/cancel.svg";
import cancelBtnImg from "@/im-sdk/assets/cancelBtn.svg";
import sendVImg from "@/im-sdk/assets/sendV.svg";
import sendVBtnImg from "@/im-sdk/assets/sendVBtn.svg";
import ImDataCenter from "@/im-sdk/ImDataCenter";
import { $t } from "@/locales";
import message from "@/utils/message";
import { nextTick, reactive, ref } from "vue";
import { VioceRecorder } from "./Voice/VioceRecorder";
/**这里的id是im的userid */
const props = defineProps<{ id: string }>();

// state:0: 取消, 1: 发送, 2: 发送
const innerData = reactive({
  state: 1,
  isRecording: false,
  text: $t("common.HoldToSpeak"),
});
// 更新区域边界信息
// 区域边界缓存
let cancelZoneRect: DOMRect | undefined;
let sendZoneRect: DOMRect | undefined;
const cancelZone = ref<HTMLElement>();
const sendZone = ref<HTMLElement>();

// 坐标区域检测
const checkInZone = (x: number, y: number, zone: any | null): boolean => {
  if (!zone) return false;
  return x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
};
// 更新区域边界信息
const updateZoneRects = (): void => {
  cancelZoneRect = cancelZone.value?.getBoundingClientRect();
  sendZoneRect = sendZone.value?.getBoundingClientRect();
};

let recorder: VioceRecorder | undefined;
/**最大录制时间 */
const maxDuration = 60 * 1000;
const startRecording = async (e: TouchEvent) => {
  innerData.isRecording = true;
  innerData.text = $t("common.ReleaseToEnd");
  nextTick(() => {
    // 初始化区域边界
    updateZoneRects();
  });
  recorder = new VioceRecorder(maxDuration);
  recorder
    .start((data) => {
      if (data.duration < 1) {
        message.error($t("common.recordTooShort"));
        return;
      }
      if (!data.blob) {
        message.error($t("common.recordError"));
        return;
      }
      const controller = ImDataCenter.getConversation(props.id, true);
      if (controller) {
        controller.sendAudioMessage(data.blob, Math.ceil(data.duration));
      } else {
        console.error("Controller is undefined");
      }
    })
    .then((success) => {
      if (!success) {
        innerData.isRecording = false;
        recorder = undefined;
      }
    });
};

// 触摸移动
const onTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;

  // 检测是否进入取消区域
  const inCancelZone = checkInZone(touchX, touchY, cancelZoneRect);

  // 检测是否进入发送区域
  const inSendZone = checkInZone(touchX, touchY, sendZoneRect);

  if (inCancelZone) {
    innerData.state = 0; // 取消
  } else if (inSendZone) {
    innerData.state = 2; // 发送
  } else {
    innerData.state = 1; // 默认状态
  }
};

// 结束录音
const endRecording = async () => {
  innerData.isRecording = false;
  if (innerData.state === 0) {
    recorder?.abort();
  } else {
    recorder?.finish();
  }
  recorder = undefined;
  // 恢复初始状态
  setTimeout(() => {
    innerData.text = $t("common.HoldToSpeak");
  }, 500);
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4.68rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 60%);
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  padding: .16rem 0.14rem;
  .status_box {
    display: flex;
    gap: 0.27rem;
    align-items: start;
    margin-bottom: 0.5rem;
    .status_text {
      font-weight: 500;
      font-size: 0.14rem;
      color: transparent;
      line-height: 0.22rem;
      margin-bottom: 0.12rem;
    }
    .active {
      color: #666666;
    }
    .imgBtn {
      width: 0.68rem;
      height: 0.68rem;
    }
  }
  .voice_box {
    width: 100%;
    height: 0.4rem;
    background: #4c72f6;
    border-radius: 0.12rem;
    display: flex;
    align-items: center;
    .audio_bars {
      display: flex;
      align-items: center;
      gap: 2px;
      height: 0.22rem;  
      padding: 0 .02rem;
      .bar {
        width: 2px;
        height: 0;
        border-radius: 0.05rem;
        background-color: #ffffff;
        animation: bounce 2.5s infinite ease-in-out;
      }
    }
    @keyframes bounce {
      0%,
      100% {
        height: 0.06rem;
        border-radius: 0.05rem;
        opacity: 1;
      }
      50% {
        height: 0.22rem;
        border-radius: 0.05rem;
        opacity: 1;
      }
    }
  }
}
</style>
