<script setup lang="ts">
import { ref, watch } from 'vue';
import avatarManager from '../manager/avatarManager';

const props = defineProps<{ src?: string }>();
const link = ref(avatarManager.defaultImg);
function load(value?: string) {
  if (!value) return;
  if (value.includes('.img')) {
    // 自定义加密图片
    link.value = value;
  } else {
    avatarManager.getImage(value).then((url) => (link.value = url));
  }
}
watch(() => props.src, load);
load(props.src);
</script>
<template>
  <img :src="link" />
</template>
