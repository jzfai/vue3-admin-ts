<template>
  <transition name="fade_slide">
    <div class="emojis_box" v-show="showEmojis" duration="0.1">
      <span
        class="emoji"
        v-for="(emoji, index) in emojis"
        :key="index"
        @click="addOneEmoji(emoji)"
        >{{ emoji }}</span
      >
    </div>
  </transition>
</template>

<script lang="ts" setup>
import emojis from '@/im-sdk/utils/emojis';

const { showEmojis } = defineProps<{
  showEmojis: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', value: string): void;
}>();
const addOneEmoji = (emoji: string) => {
  // 触发选择事件
  emit('select', emoji);
};
</script>

<style lang="scss" scoped>
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
  column-gap: 0.12rem;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 0.16rem;
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

// 动画
.fade_slide-enter-active,
.fade_slide-leave-active {
  transition: all 0.3s ease;
}

.fade_slide-enter-from,
.fade_slide-leave-to {
  opacity: 0;
}

.fade_slide-enter-to,
.fade_slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
