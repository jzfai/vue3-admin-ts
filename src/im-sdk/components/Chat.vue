<template>
  <div class="chat_container">
    <ChatNav></ChatNav>
    <div
      class="main_content"
      ref="messageContainer"
      @click="onClickMessageArea"
      @scroll="onScroll"
    >
      <div v-for="msg in messages" :key="msg.id" class="chat_item">
        <component :is="config.messageItemRender" :data="msg" />
      </div>
    </div>

    <ChatMenu :id="userId" ref="chatMenuRef" />
  </div>
</template>

<script lang="ts" setup>
import ChatMenu from '@/im-sdk/widget/ChatMenu.vue';
import ChatNav from '@/im-sdk/widget/chatNav/ChatNav.vue';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import config from '../config';
import ImDataCenter from '../ImDataCenter';

const route = useRoute();
const userId = String(route.query.id);
function onScroll() {
  const el = messageContainer.value;
  if (!el) return;

  if (el.scrollTop === 0) {
    const oldScrollHeight = el.scrollHeight;

    // 加载更多
    controller?.loadMore().then(() => {
      nextTick(() => {
        const newScrollHeight = el.scrollHeight;
        const delta = newScrollHeight - oldScrollHeight;
        el.scrollTop = delta; // 保持滚动位置不变
      });
    });
  }
}


const messageContainer = ref<HTMLDivElement>();
// 消息
const controller = ImDataCenter.getConversation(userId, true)!;
const messages = controller.messages;

// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTo({
        top: messageContainer.value.scrollHeight,
        behavior, // 平滑滚动
      });
    }
  });
};

// 点击关闭工具栏
const chatMenuRef = ref<InstanceType<typeof ChatMenu> | null>(null);
const onClickMessageArea = () => {
  chatMenuRef.value?.hideTool();
};

// 监听底部
const scrollListener = () => {
  const el = messageContainer.value;
  if (!el) return false;

  // 获取最后一条消息元素
  const lastMessageEl = el.querySelector(
    '.chat_item:last-child'
  ) as HTMLElement;
  if (!lastMessageEl) return false;

  const lastHeight = lastMessageEl.offsetHeight;

  // 判断距离底部的距离是否小于最后一条消息高度
  const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

  return distanceToBottom <= lastHeight;
};

// 监听消息变化，自动滚动到底部
watch(
  messages,
  (newMessages, oldMessages) => {
    const lastNew = newMessages.at(-1);
    const lastOld = oldMessages?.at(-1);

    const el = messageContainer.value;
    if (!el || !lastNew) return;

    controller.clearUnread();

    // 只有最后一条消息不同才滚动
    const isNewMessage = !lastOld || lastNew.id !== lastOld.id;

    if (
      isNewMessage &&
      ((lastNew.to === lastNew.target) || scrollListener())
    ) {
      scrollToBottom();
    }
  },
  { deep: true }
);



onMounted(() => {
  controller.clearUnread();
  scrollToBottom('auto');
});
</script>
<style lang="scss" scoped>
.chat_container {
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  width: 100%;
  height: 100dvh;
  .main_content {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    background-color: #f5f5f5;
    padding: 0.14rem;
    display: flex;
    flex-direction: column;
    scrollbar-width: 0;
    .chat_item {
      margin-bottom: 0.24rem;
    }
    .chat_item:first-child {
      margin-top: auto;
    }
  }
}
</style>
