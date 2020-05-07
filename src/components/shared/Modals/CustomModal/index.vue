<template>
  <div>
    <div v-if="title" class="c-modal-header t-modal-header">
      <div class="title-modal">{{ $t(title) }}</div>
      <div
        v-if="forceChoose"
        class="c-modal-header-close"
        (click)="dismiss.emit()"
      ></div>
    </div>
    <slot v-else name="header"></slot>
    <div v-if="message" class="c-modal-body-2">
      <p class="t-modal-body-text" v-html="$t(message)"></p>
    </div>
    <div class="modal-body">
      <slot v-if="!message" name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomModal",
  props: {
    title: String,
    message: String,
    forceChoose: Boolean
  }
};
</script>

<style></style>
