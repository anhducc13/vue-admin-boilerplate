<template>
  <a-button 
    :size="size"
    :type="type"
    :disabled="disabled"
    :html-type="htmlType"
    @click="$emit('action')">
    <div v-if="!loader">
      <slot></slot>
    </div>
    <div v-else class="loading-icon"></div>
  </a-button>
</template>

<script>
export default {
  name: "ActionButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    loader: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    type: {
      type: String,
      default: 'primary'
    },
    htmlType: String
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/everything.scss";
.loading-icon {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
  &:after {
    animation: spin 600ms linear infinite;
    border-bottom: 1px solid darken($prepaird-gray, 50%);
    border-left: 1px solid darken($prepaird-gray, 10%);
    border-radius: 100%;
    border-right: 1px solid darken($prepaird-gray, 50%);
    border-top: 1px solid darken($prepaird-gray, 10%);
    content: '';
    display: block;
    height: 15px;
    position: relative;
    width: 15px;
  }
}
</style>