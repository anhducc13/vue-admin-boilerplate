<template>
  <svg
    v-if="metadata"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    :width="metadata.width"
    :height="metadata.height"
    :viewBox="metadata.viewBox"
  >
    <use v-if="metadata" :xlink:href="'#' + metadata.id" />
  </svg>
</template>

<script>
import { get as getSvg } from "./SvgService";
export default {
  name: "SvgIcon",
  props: ["src"],
  data() {
    return {
      metadata: null
    };
  },
  async created() {
    this.metadata = await getSvg(this.src);
  }
};
</script>

<style></style>
