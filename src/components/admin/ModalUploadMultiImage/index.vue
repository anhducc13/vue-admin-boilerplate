<template>
  <a-modal
    :maskClosable="false"
    destroyOnClose
    :title="$t('upload.ADD_MORE_IMAGE')"
    v-bind="$attrs"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-upload
      v-if="fileList.length > 0"
      :action="() => {}"
      listType="picture-card"
      :fileList="fileList"
      @change="handleChange"
    />
    <ImageCropper
      :width="400"
      :height="500"
      :noCircle="true"
      :showCancel="false"
      :emitEvent="true"
      resetWhenCropped
      :textEmitEvent="'upload.CROP'"
      @crop-success="cropSuccess"
    />
  </a-modal>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import ImageCropper from "@/components/shared/ImageCropper";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: { ImageCropper },
  data() {
    return {
      fileList: []
    };
  },
  computed: {},
  methods: {
    handleOk() {
      this.$emit("ok", this.fileList);
      this.fileList = [];
    },
    handleCancel() {
      this.$emit("cancel");
      this.fileList = [];
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },
    cropSuccess(data) {
      const { createImgUrl, imgFormat, mime } = data;
      const id = uuidv4();
      this.fileList.push({
        uid: id,
        name: id,
        url: createImgUrl,
        imgFormat,
        mime
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-view {
  max-height: 300px;
  overflow-y: scroll;
}
</style>