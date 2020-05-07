<template>
  <div class="modal-body">
    <div class="preview-modal-body">
      <iframe v-if="previewUrl" :src="previewUrl" style="width: 100%; height: 600px" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import { configConstants } from "@/constants";
import { Url } from "@/helpers";
export default {
  name: "PreviewPdfModal",
  props: ["previewUrl"]
}
</script>

<style>
.preview-modal-body{
  background-color: #ffffff;
  padding: 15px;
  border-radius: 5px;
}
</style>