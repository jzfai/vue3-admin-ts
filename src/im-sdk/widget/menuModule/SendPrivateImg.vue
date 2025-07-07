<template>
  <div class="media-uploader">
    <img :src="picMenuImg" @click="triggerFileInput" class="upload-icon" />
    <input
      type="file"
      ref="fileInput"
      @change="sendMedia"
      accept="image/*,video/*"
      style="display: none"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import picMenuImg from '@/im-sdk/assets/picMenu.svg';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import message from '@/utils/message';

const props = defineProps<{ id: string }>();

// 文件类型正则
const imageRegex = /(jpeg|jpg|png|gif|webp|svg)$/i;
const videoRegex = /(mp4|webm|ogg|mov)$/i;

const fileInput = ref<HTMLInputElement>();

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 发送媒体消息
const sendMedia = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;
  const file = files[0];
  if (!file) return;

  const fileType = file.type;
  const controller = ImDataCenter.getConversation(props.id, true);

  if (!controller) {
    message.error('聊天会话不存在');
    return;
  }

  try {
    if (imageRegex.test(fileType)) {
      await controller.sendImageMessage(file);
    } else if (videoRegex.test(fileType)) {
      await controller.sendVideoMessage(file);
    } else {
      message.error(fileType);
    }
  } catch (err) {
    message.error('发送失败');
    console.error('发送媒体失败', err);
  } finally {
    // 清空 input，避免重复上传同一个文件时不触发 change
    fileInput.value!.value = '';
  }
};
</script>

<style scoped></style>
