<template>
  <div class="message-list-item">
    <!-- 头像 -->
    <div class="item-avatar">
      <UserHead :img="data.user?.avatar" class="avatar"></UserHead>
      <span v-if="data.isPinned" class="isOnline"></span>
    </div>
    <!-- 内容 -->
    <div class="item-content">
      <!-- 用户信息 -->
      <div class="item-title">
        <div class="item-title-name">
          <div class="item-title-nickname">
            {{ data.user?.name }}
          </div>
          <!-- 未读 -->
          <div class="item-title-unread" v-if="data.unReadCount">
            {{ data.unReadCount }}
          </div>
        </div>

        <div class="item-brief-time">
          {{ renderTimeToYear(data.time) }}
        </div>
      </div>
      <!-- 消息内容 -->
      <div class="item-brief">
        <div class="item-brief-text">{{ data.last?.brief }}</div>
        <!-- <span class="item-title-price" v-if="item.userData?.textChatPrice != 0">
          <span class="daostrip">{{ item.userData?.textChatPrice }}</span>
          <span class="daostrip-text">{{
            $t('message.messagelist.daostrip')
          }}</span>
        </span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { renderTimeToYear } from '@/im-sdk/utils/timestamp';
import { ConversationData } from '../types';

const { data } = defineProps<{
  data: ConversationData;
}>();
console.log('ConversationItem', data);

</script>

<style lang="scss" scoped>
.message-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  .item-avatar {
    width: 0.56rem;
    height: 0.56rem;
    overflow: hidden;
    position: relative;

    .isOnline {
      position: absolute;
      bottom: 0.02rem;
      right: 0.02rem;
      width: 0.1rem;
      height: 0.1rem;
      background-color: #0ce1c1;
      border: 0.01rem solid #ffffff;
      border-radius: 50%;
    }
  }

  .item-content {
    flex: 1;
    height: 0.48rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 0.1rem;

    .item-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item-brief-time {
        font-size: 0.12rem;
        line-height: 0.18rem;
        color: #999999;
      }

      .item-title-name {
        display: flex;
        align-items: center;
        font-size: 0.16rem;
        line-height: 0.25rem;
        font-weight: 600;
        color: #1d1b20;

        .item-title-nickname {
          max-width: 1.67rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-title-unread {
          font-size: 0.12rem;
          line-height: 0.12rem;
          color: #ffffff;
          font-weight: 600;
          background-color: #fb3344;
          border-radius: 0.2rem;
          padding: 0.02rem 0.06rem;
          margin-left: 0.06rem;
        }
      }
    }

    .item-brief {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item-brief-text {
        display: inline-block;
        align-items: center;
        line-height: 0.2rem;
        font-size: 0.14rem;
        max-width: 1.81rem;
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-title-price {
        height: 0.2rem;
        line-height: 0.2rem;
        color: #1d1b20;
        margin-left: auto;
        font-weight: 600;
        font-size: 0.12rem;
        color: #666666;
      }
    }
  }
}
</style>
