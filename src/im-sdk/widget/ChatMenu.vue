<template>
  <!-- 输入栏 -->
  <div class="bottom_box">
    <div class="bottom_top">
      <!-- <img :src="giftIcon" class="gift_icon" v-show="!showVoice" /> -->
      <div class="input_box" ref="inputBox">
        <div class="other_box">
          <img
            :src="showVoice ? keyboardIcon : audioBtnIcon"
            alt=""
            ref="longPressEle"
            @click="
              showVoice = !showVoice;
              showTool = false;
            "
          />
        </div>
        <textarea
          v-model.trim="peerMessage"
          ref="textarea"
          class="input_text"
          :placeholder="$t('common.sendMessage')"
          @input="resizeTextarea"
          @focus="showTool = false"
          maxlength="1000"
          v-show="!showVoice"
        ></textarea>
        <div class="voiceBtn" v-show="showVoice">
          <VoiceBtn :id="id" />
        </div>
        <div class="other_box">
          <img
            :src="showEmojis ? keyboardIcon : emojiIcon"
            @click="showToolBox(1)"
          />
          <div v-if="!peerMessage">
            <img
              :src="expandIcon"
              @click="showToolBox(0)"
              :style="
                showTool && tabs === 0 ? { transform: 'rotate(45deg)' } : {}
              "
            />
          </div>
          <div class="send_btn" @click="sendMessage" v-else>
            <img :src="sendIcon" />
          </div>
        </div>
      </div>
    </div>
    <transition name="fade_slide">
      <div v-show="showTool">
        <div class="bottom_content" v-show="tabs === 0">
          <component
            v-for="(item, index) in chatMenus"
            :key="index"
            :is="item"
            :id="id"
            class="content_tool"
          />
        </div>
        <EmojiMap v-model:showEmojis="showEmojis" @select="handleSelectEmoji" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import emojiIcon from '@/im-sdk/assets/emoji.svg';
import keyboardIcon from '@/im-sdk/assets/keyboard.svg';
import sendIcon from '@/im-sdk/assets/send.svg';
import expandIcon from '@/im-sdk/assets/toolbar.svg';
import audioBtnIcon from '@/im-sdk/assets/voice.svg';
import EmojiMap from '@/im-sdk/widget/menuModule/EmojiMap.vue';
import VoiceBtn from '@/im-sdk/widget/menuModule/VoiceBtn.vue';
import { $t } from '@/locales';
import { onMounted, ref } from 'vue';
import ImDataCenter from '../ImDataCenter';
import config from '../config';

const { id } = defineProps<{ id: string }>();

const chatMenus = config.chatMenus;

// 输入框模块
const showVoice = ref(false);
const peerMessage = ref('');

// 解决软键盘弹起时 textarea 高度不变的问题
const textarea = ref<HTMLTextAreaElement | null>(null);
const inputBox = ref<HTMLDivElement | null>(null);
const resizeTextarea = () => {
  const el = textarea.value;
  const box = inputBox.value;
  if (!el) return;

  const maxHeight = 96; // 最大高度，单位是 px（你可以用 rem 转换后写死样式）

  el.style.height = '0.24rem'; // 先重置高度以便获取准确 scrollHeight
  el.style.overflowY = 'hidden'; // 初始先隐藏滚动条

  const scrollHeight = el.scrollHeight;

  if (scrollHeight > maxHeight) {
    el.style.height = maxHeight + 'px';
    el.style.overflowY = 'auto'; // 超出最大高度后显示滚动条
  } else {
    el.style.height = scrollHeight + 'px';
  }
};

// 重置高度时也隐藏滚动条
const resetHeight = () => {
  const el = textarea.value;
  if (!el) return;
  el.style.height = '.24rem';
  el.style.overflowY = 'hidden';
};

//// 控制工具栏展示
const showTool = ref(false);
// 0: 工具 1: 表情
const tabs = ref(0);
const showEmojis = ref(false);
const showToolBox = (tab: number) => {
  showVoice.value = false;
  if (tabs.value === tab || !showTool.value) {
    showTool.value = !showTool.value;
  }
  tabs.value = tab;
  if (tabs.value === 0 || !showTool.value) {
    showEmojis.value = false;
  } else {
    showEmojis.value = true;
  }
};

// 表情输入
const handleSelectEmoji = (emoji: string) => {
  peerMessage.value += emoji;
};

// 发送逻辑
const sendMessage = async () => {
  const controller = ImDataCenter.getConversation(id, true);
  controller?.sendTextMessage(peerMessage.value);
  peerMessage.value = ''; // 发送后清空输入框
  resetHeight(); // 重置高度
  showTool.value = false; // 发送后隐藏工具栏
  showEmojis.value = false;
};

// 提供控制方法给父组件
const hideTool = () => {
  showTool.value = false;
  showEmojis.value = false;
};

defineExpose({
  hideTool,
});

//注册式菜单组件

onMounted(() => {
  resizeTextarea();
});
</script>

<style lang="scss" scoped>
.bottom_box {
  width: 100%;
  background-color: #fff;
  box-shadow: 0px -1px 2px 0px #d6d6d6;
  .bottom_top {
    padding: 0.12rem 0.12rem 0.16rem;
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 0.1rem;
    .gift_icon {
      width: 0.26rem;
      height: 0.26rem;
      margin-bottom: 0.07rem;
    }
    .input_box {
      flex: 1;
      background: #f5f5f5;
      border-radius: 0.12rem;
      display: flex;
      align-items: end;
      padding: 0 0.06rem;
      min-height: 0.4rem;
      gap: 0.12rem;
      .input_text {
        flex: 1;
        resize: none;
        background-color: transparent;
        font-weight: 400;
        font-size: 0.16rem;
        color: #222222;
        line-height: 0.22rem;
        margin: 0.08rem 0;
      }
      .voiceBtn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.08rem;
      }
      .other_box {
        display: flex;
        align-items: center;
        height: 0.4rem;
        gap: 0.12rem;
      }
      .send_btn {
        font-weight: 500;
        font-size: 0.14rem;
        color: #ffffff;
        line-height: 0.2rem;
        padding: 0.06rem 0.12rem;
        background: #ffb001;
        border-radius: 0.12rem;
        > img {
          width: 0.2rem;
          height: 0.2rem;
        }
      }
    }
  }
  .bottom_content {
    display: flex;
    padding: 0.04rem 0.38rem 0.25rem;
    gap: 0.68rem;
    .content_tool {
      width: 0.26rem;
      height: 0.26rem;
    }
    // 表情
    .emojis_box {
      height: 1.6rem;
      width: 100%;
      overflow-y: auto;
      padding: 0.04rem;
      box-shadow: 0 0 0.02rem rgb(223, 221, 221);
      -ms-overflow-style: none;
      /* Internet Explorer 10+ */
      scrollbar-width: none;
      /* Firefox */
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &::-webkit-scrollbar {
        display: none;
        /* Safari and Chrome */
      }

      &::after {
        content: '';
        flex: 1 1 auto;
      }

      .emoji {
        font-size: 0.28rem;
      }
    }
  }
}

// 工具栏动画
.fade_slide-enter-active,
.fade_slide-leave-active {
  transition: all 0.3s ease;
}

.fade_slide-enter-from,
.fade_slide-leave-to {
  opacity: 0;
  transform: translateY(0.1rem);
}

.fade_slide-enter-to,
.fade_slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
