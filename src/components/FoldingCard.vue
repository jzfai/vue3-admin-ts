<template>
  <div class="aulton-card pl24 pr24" :class="{ folded: isFolded }">
    <div class="card-header">
      <!--  title标识线     -->
      <div class="identification-line"></div>
      <div class="card-title">{{ title }}</div>
      <div class="line"></div>
      <div class="toggle-btn" @click="handleToggleFolded">
        <span>{{ toggleBtnName }}</span>
        <svg-icon :icon-class="toggleIcon" class="toggle-icon" />
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  mixins: [],
  props: {
    title: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      isFolded: false // 折叠
    }
  },
  computed: {
    toggleBtnName() {
      return this.isFolded ? '展开' : '收起'
    },
    toggleIcon() {
      return this.isFolded ? 'cart-up' : 'cart-up'
    }
  },
  methods: {
    handleToggleFolded() {
      this.isFolded = !this.isFolded
    },
    open() {
      this.isFolded = false
    }
  }
}
</script>

<style lang="scss" scoped>
//标识线
.identification-line {
  width: 2px;
  height: 18px;
  /* 品牌色normal */
  position: relative;
  top: 3px;
  background: #c72210;
  border-radius: 23px;
}

.aulton-card {
  padding: 20px 0;
  padding-bottom: 10px;
  background: #ffffff;
  border-radius: 4px;
  .card-body {
    margin-top: 24px;
    transition: height linear 0.6s;
  }
  &.folded {
    padding-bottom: 20px;
    .card-body {
      height: 0;
      margin-top: 0;
      overflow: hidden;
    }
  }
}
.card-header {
  display: flex;
  .card-title {
    position: relative;
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
    padding-left: 6px;
    color: var(--blackColor);
    &::before {
      position: absolute;
      content: '';
      display: block;
      width: 2px;
      height: 18px;
      top: 0;
      left: 0;
      bottom: 0;
      margin: auto;
      background: var(--brandColor);
      border-radius: 23px;
    }
  }
  .line {
    flex: 1;
    height: 1px;
    margin: 11px 12px;
    background: #f0f0f0;
  }
  .toggle-btn {
    font-size: 14px;
    line-height: 22px;
    color: var(--tipColor);
    cursor: pointer;
  }
  .toggle-icon {
    width: 12px;
    height: 12px;
    margin-left: 5px;
    vertical-align: -1px;
  }
}
</style>
