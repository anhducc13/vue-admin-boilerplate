<template>
  <div class="vue-image-crop-upload">
    <div class="vicp-wrap">
      <div v-show="step == 1" class="vicp-step1">
        <div
          class="vicp-drop-area"
          @dragleave="preventDefault"
          @dragover="preventDefault"
          @dragenter="preventDefault"
          @click="handleClick"
          @drop="handleChange"
        >
          <div v-show="loading != 1" class="vicp-icon1">
            <a-icon type="inbox" />
          </div>
          <span v-show="loading !== 1" class="vicp-hint">{{ $t("upload.HINT") }}</span>
          <span v-show="!isSupported" class="vicp-no-supported-hint">{{ $t("upload.NO_SUPPORTED") }}</span>
          <input v-show="false" v-if="step == 1" ref="fileinput" type="file" @change="handleChange" />
        </div>
        <div v-show="hasError" class="vicp-error">
          <i class="vicp-icon2" />
          {{ errorMsg }}
        </div>
        <div v-if="showCancel" class="vicp-operate">
          <a-button class="button-right" @click="off">{{ $t("upload.OFF") }}</a-button>
        </div>
      </div>
      <div v-if="step == 2" class="vicp-step2">
        <div class="vicp-crop">
          <div v-show="true" class="vicp-crop-left">
            <div class="vicp-img-container">
              <img
                ref="img"
                :src="sourceImgUrl"
                :style="sourceImgStyle"
                class="vicp-img"
                draggable="false"
                @drag="preventDefault"
                @dragstart="preventDefault"
                @dragend="preventDefault"
                @dragleave="preventDefault"
                @dragover="preventDefault"
                @dragenter="preventDefault"
                @drop="preventDefault"
                @touchstart="imgStartMove"
                @touchmove="imgMove"
                @touchend="createImg"
                @touchcancel="createImg"
                @mousedown="imgStartMove"
                @mousemove="imgMove"
                @mouseup="createImg"
                @mouseout="createImg"
              />
              <div :style="sourceImgShadeStyle" class="vicp-img-shade vicp-img-shade-1" />
              <div :style="sourceImgShadeStyle" class="vicp-img-shade vicp-img-shade-2" />
            </div>

            <div class="vicp-range">
              <a-slider :step="1" :min="0" :max="100" @change="zoomChange" :value="scale.range" />
              <template v-if="!noRotate">
                <a-button type="link" @mousedown="startRotateLeft" @mouseout="endRotate" @mouseup="endRotate">↺</a-button>
                <a-button type="link" @mousedown="startRotateRight" @mouseout="endRotate" @mouseup="endRotate">↻</a-button>
              </template>
            </div>
          </div>
          <div v-show="true" class="vicp-crop-right">
            <div class="vicp-preview">
              <div v-if="!noSquare" class="vicp-preview-item">
                <img :src="createImgUrl" :style="previewStyle" />
                <span>{{ $t("upload.PREVIEW") }}</span>
              </div>
              <div v-if="!noCircle" class="vicp-preview-item vicp-preview-item-circle">
                <img :src="createImgUrl" :style="previewStyle" />
                <span>{{ $t("upload.PREVIEW") }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="vicp-operate">
          <a-button class="button-right" type="primary" @click="prepareUpload">{{ textEmitEvent ? $t(textEmitEvent) :  $t("upload.SAVE") }}</a-button>
          <a-button @click="setStep(1)">{{ $t("upload.BACK") }}</a-button>
        </div>
      </div>
      <div v-if="step == 3" class="vicp-step3">
        <div class="vicp-upload">
          <span v-show="loading === 1" class="vicp-loading">{{ $t("upload.LOADING") }}</span>
          <div class="vicp-progress-wrap">
            <span v-show="loading === 1" :style="progressStyle" class="vicp-progress" />
          </div>
          <div v-show="hasError" class="vicp-error">
            <i class="vicp-icon2" />
            {{ errorMsg }}
          </div>
          <div v-show="loading === 2" class="vicp-success">
            <i class="vicp-icon3" />
            {{ $t("upload.SUCCESS") }}
          </div>
        </div>
        <div class="vicp-operate">
          <a-button class="button-right" type="primary" @click="off">{{ $t("upload.CLOSE") }}</a-button>
          <a-button @click="setStep(2)">{{ $t("upload.BACK") }}</a-button>
        </div>
      </div>
      <canvas v-show="false" ref="canvas" :width="width" :height="height" />
    </div>
  </div>
</template>

<script>
"use strict";
import mimes from "./utils/mimes.js";
import data2blob from "./utils/data2blob.js";
export default {
  name: "ImageCropper",
  props: {
    field: {
      type: String,
      default: "avatar"
    },
    ki: {
      type: Number,
      default: 0
    },
    value: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: ""
    },
    params: {
      type: Object,
      default: null
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    noRotate: {
      type: Boolean,
      default: false
    },
    noCircle: {
      type: Boolean,
      default: false
    },
    noSquare: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 10240
    },
    imgFormat: {
      type: String,
      default: "png"
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    textEmitEvent: String,
    resetWhenCropped: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    const { imgFormat, width, height } = this;
    let isSupported = true;
    const allowImgFormat = ["jpg", "png"];
    const tempImgFormat =
      allowImgFormat.indexOf(imgFormat) === -1 ? "jpg" : imgFormat;
    const mime = mimes[tempImgFormat];
    this.imgFormat = tempImgFormat;
    if (typeof FormData !== "function") {
      isSupported = false;
    }
    return {
      mime,
      isSupported,
      isSupportTouch: document.hasOwnProperty("ontouchstart"),
      step: 1,
      loading: 0,
      progress: 0,
      hasError: false,
      errorMsg: "",
      ratio: width / height,
      sourceImg: null,
      sourceImgUrl: "",
      createImgUrl: "",
      sourceImgMouseDown: {
        on: false,
        mX: 0,
        mY: 0,
        x: 0,
        y: 0
      },
      previewContainer: {
        width: 184,
        height: 184
      },
      sourceImgContainer: {
        width: 240,
        height: 184
      },
      scale: {
        zoomAddOn: false,
        zoomSubOn: false,
        range: 1,
        rotateLeft: false,
        rotateRight: false,
        degree: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0,
        minHeight: 0,
        naturalWidth: 0,
        naturalHeight: 0
      }
    };
  },
  computed: {
    progressStyle() {
      const { progress } = this;
      return {
        width: progress + "%"
      };
    },
    sourceImgStyle() {
      const { scale, sourceImgMasking } = this;
      const top = scale.y + sourceImgMasking.y + "px";
      const left = scale.x + sourceImgMasking.x + "px";
      return {
        top,
        left,
        width: scale.width + "px",
        height: scale.height + "px",
        transform: "rotate(" + scale.degree + "deg)",
        "-ms-transform": "rotate(" + scale.degree + "deg)",
        "-moz-transform": "rotate(" + scale.degree + "deg)",
        "-webkit-transform": "rotate(" + scale.degree + "deg)",
        "-o-transform": "rotate(" + scale.degree + "deg)"
      };
    },
    sourceImgMasking() {
      const { width, height, ratio, sourceImgContainer } = this;
      const sic = sourceImgContainer;
      const sicRatio = sic.width / sic.height;
      let x = 0;
      let y = 0;
      let w = sic.width;
      let h = sic.height;
      let scale = 1;
      if (ratio < sicRatio) {
        scale = sic.height / height;
        w = sic.height * ratio;
        x = (sic.width - w) / 2;
      }
      if (ratio > sicRatio) {
        scale = sic.width / width;
        h = sic.width / ratio;
        y = (sic.height - h) / 2;
      }
      return {
        scale,
        x,
        y,
        width: w,
        height: h
      };
    },
    sourceImgShadeStyle() {
      const { sourceImgMasking, sourceImgContainer } = this;
      const sic = sourceImgContainer;
      const sim = sourceImgMasking;
      const w =
        sim.width === sic.width ? sim.width : (sic.width - sim.width) / 2;
      const h =
        sim.height === sic.height ? sim.height : (sic.height - sim.height) / 2;
      return {
        width: w + "px",
        height: h + "px"
      };
    },
    previewStyle() {
      const { ratio, previewContainer } = this;
      const pc = previewContainer;
      let w = pc.width;
      let h = pc.height;
      const pcRatio = w / h;
      if (ratio < pcRatio) {
        w = pc.height * ratio;
      }
      if (ratio > pcRatio) {
        h = pc.width / ratio;
      }
      return {
        width: w + "px",
        height: h + "px"
      };
    }
  },
  watch: {
    value(newValue) {
      if (newValue && this.loading !== 1) {
        this.reset();
      }
    }
  },
  created() {
    document.addEventListener("keyup", this.closeHandler);
  },
  destroyed() {
    document.removeEventListener("keyup", this.closeHandler);
  },
  methods: {
    off() {
      setTimeout(() => {
        this.$emit("input", false);
        this.$emit("close");
        if (this.step === 3 && this.loading === 2) {
          this.setStep(1);
        }
      }, 200);
    },
    setStep(no) {
      setTimeout(() => {
        this.step = no;
      }, 200);
    },
    /* ---------------------------------------------------------------*/
    preventDefault(e) {
      e.preventDefault();
      return false;
    },
    handleClick(e) {
      if (this.loading !== 1) {
        if (e.target !== this.$refs.fileinput) {
          e.preventDefault();
          if (document.activeElement !== this.$refs) {
            this.$refs.fileinput.click();
          }
        }
      }
    },
    handleChange(e) {
      e.preventDefault();
      if (this.loading !== 1) {
        const files = e.target.files || e.dataTransfer.files;
        this.reset();
        if (this.checkFile(files[0])) {
          this.setSourceImg(files[0]);
        }
      }
    },
    /* ---------------------------------------------------------------*/
    checkFile(file) {
      const { maxSize } = this;
      if (!file || !file.type) {
         return false;
      }
      if (file.type.indexOf("image") === -1) {
        this.hasError = true;
        this.errorMsg = this.$t("upload.ONLY_IMG");
        return false;
      }
      if (file.size / 1024 > maxSize) {
        this.hasError = true;
        this.errorMsg = this.$t("upload.UT_OF_SIZE") + maxSize + "kb";
        return false;
      }
      return true;
    },
    reset() {
      this.loading = 0;
      this.hasError = false;
      this.errorMsg = "";
      this.progress = 0;
    },
    setSourceImg(file) {
      const fr = new FileReader();
      fr.onload = e => {
        this.sourceImgUrl = fr.result;
        this.startCrop();
      };
      fr.readAsDataURL(file);
    },
    startCrop() {
      const {
        width,
        height,
        ratio,
        scale,
        sourceImgUrl,
        sourceImgMasking
      } = this;
      const sim = sourceImgMasking;
      const img = new Image();
      img.src = sourceImgUrl;
      img.onload = () => {
        const nWidth = img.naturalWidth;
        const nHeight = img.naturalHeight;
        const nRatio = nWidth / nHeight;
        let w = sim.width;
        let h = sim.height;
        let x = 0;
        let y = 0;
        if (nWidth < width || nHeight < height) {
          this.hasError = true;
          this.errorMsg = this.$t("upload.LOWEST_PX") + width + "*" + height;
          return false;
        }
        if (ratio > nRatio) {
          h = w / nRatio;
          y = (sim.height - h) / 2;
        }
        if (ratio < nRatio) {
          w = h * nRatio;
          x = (sim.width - w) / 2;
        }
        scale.range = 0;
        scale.x = x;
        scale.y = y;
        scale.width = w;
        scale.height = h;
        scale.degree = 0;
        scale.minWidth = w;
        scale.minHeight = h;
        scale.maxWidth = nWidth * sim.scale;
        scale.maxHeight = nHeight * sim.scale;
        scale.naturalWidth = nWidth;
        scale.naturalHeight = nHeight;
        this.sourceImg = img;
        this.createImg();
        this.setStep(2);
      };
    },
    imgStartMove(e) {
      e.preventDefault();
      if (this.isSupportTouch && !e.targetTouches) {
        return false;
      }
      const et = e.targetTouches ? e.targetTouches[0] : e;
      const { sourceImgMouseDown, scale } = this;
      const simd = sourceImgMouseDown;
      simd.mX = et.screenX;
      simd.mY = et.screenY;
      simd.x = scale.x;
      simd.y = scale.y;
      simd.on = true;
    },
    imgMove(e) {
      e.preventDefault();
      if (this.isSupportTouch && !e.targetTouches) {
        return false;
      }
      const et = e.targetTouches ? e.targetTouches[0] : e;
      const {
        sourceImgMouseDown: { on, mX, mY, x, y },
        scale,
        sourceImgMasking
      } = this;
      const sim = sourceImgMasking;
      const nX = et.screenX;
      const nY = et.screenY;
      const dX = nX - mX;
      const dY = nY - mY;
      let rX = x + dX;
      let rY = y + dY;
      if (!on) return;
      if (rX > 0) {
        rX = 0;
      }
      if (rY > 0) {
        rY = 0;
      }
      if (rX < sim.width - scale.width) {
        rX = sim.width - scale.width;
      }
      if (rY < sim.height - scale.height) {
        rY = sim.height - scale.height;
      }
      scale.x = rX;
      scale.y = rY;
    },
    startRotateRight(e) {
      const { scale } = this;
      scale.rotateRight = true;
      const rotate = () => {
        if (scale.rotateRight) {
          const degree = ++scale.degree;
          this.createImg(degree);
          setTimeout(function() {
            rotate();
          }, 60);
        }
      };
      rotate();
    },
    startRotateLeft(e) {
      const { scale } = this;
      scale.rotateLeft = true;
      const rotate = () => {
        if (scale.rotateLeft) {
          const degree = --scale.degree;
          this.createImg(degree);
          setTimeout(function() {
            rotate();
          }, 60);
        }
      };
      rotate();
    },
    endRotate() {
      const { scale } = this;
      scale.rotateLeft = false;
      scale.rotateRight = false;
    },
    startZoomAdd(e) {
      const { scale } = this;
      scale.zoomAddOn = true;
      const zoom = () => {
        if (scale.zoomAddOn) {
          const range = scale.range >= 100 ? 100 : ++scale.range;
          this.zoomImg(range);
          setTimeout(function() {
            zoom();
          }, 60);
        }
      };
      zoom();
    },
    endZoomAdd(e) {
      this.scale.zoomAddOn = false;
    },
    startZoomSub(e) {
      const { scale } = this;
      scale.zoomSubOn = true;
      const zoom = () => {
        if (scale.zoomSubOn) {
          const range = scale.range <= 0 ? 0 : --scale.range;
          this.zoomImg(range);
          setTimeout(function() {
            zoom();
          }, 60);
        }
      };
      zoom();
    },
    endZoomSub(e) {
      const { scale } = this;
      scale.zoomSubOn = false;
    },
    zoomChange(value) {
      this.zoomImg(value);
    },
    zoomImg(newRange) {
      const { sourceImgMasking, scale } = this;
      const {
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
        width,
        height,
        x,
        y
      } = scale;
      const sim = sourceImgMasking;
      const sWidth = sim.width;
      const sHeight = sim.height;
      const nWidth = minWidth + ((maxWidth - minWidth) * newRange) / 100;
      const nHeight = minHeight + ((maxHeight - minHeight) * newRange) / 100;
      let nX = sWidth / 2 - (nWidth / width) * (sWidth / 2 - x);
      let nY = sHeight / 2 - (nHeight / height) * (sHeight / 2 - y);
      if (nX > 0) {
        nX = 0;
      }
      if (nY > 0) {
        nY = 0;
      }
      if (nX < sWidth - nWidth) {
        nX = sWidth - nWidth;
      }
      if (nY < sHeight - nHeight) {
        nY = sHeight - nHeight;
      }
      scale.x = nX;
      scale.y = nY;
      scale.width = nWidth;
      scale.height = nHeight;
      scale.range = newRange;
      setTimeout(() => {
        if (scale.range === newRange) {
          this.createImg();
        }
      }, 300);
    },
    createImg(e) {
      const {
        mime,
        sourceImg,
        scale: { x, y, width, height, degree },
        sourceImgMasking: { scale }
      } = this;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      if (e) {
        this.sourceImgMouseDown.on = false;
      }
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.translate(this.width * 0.5, this.height * 0.5);
      ctx.rotate((Math.PI * degree) / 180);
      ctx.translate(-this.width * 0.5, -this.height * 0.5);
      ctx.drawImage(
        sourceImg,
        x / scale,
        y / scale,
        width / scale,
        height / scale
      );
      this.createImgUrl = canvas.toDataURL(mime);
    },
    prepareUpload() {
      const { url, createImgUrl, field, mime, ki, imgFormat } = this;
      this.$emit("crop-success", {createImgUrl, imgFormat, mime, field, ki});
      if (this.resetWhenCropped) {
        this.setStep(1);
      }
      if (typeof url === "string" && url) {
        this.upload();
      } else {
        this.off();
      }
    },
    upload() {
      const {
        imgFormat,
        mime,
        url,
        params,
        field,
        ki,
        createImgUrl
      } = this;
      const fmData = new FormData();
      fmData.append(
        field,
        data2blob(createImgUrl, mime),
        field + "." + imgFormat
      );
      if (typeof params === "object" && params) {
        Object.keys(params).forEach(k => {
          fmData.append(k, params[k]);
        });
      }
      this.reset();
      this.loading = 1;
      this.setStep(3);
      
      this.$axios.post(url, fmData)
        .then(resData => {
          this.loading = 2;
          setTimeout(() => {
            this.$emit("crop-upload-success", resData.data);
          }, 100);
        })
        .catch(err => {
          if (this.value) {
            this.loading = 3;
            this.hasError = true;
            this.errorMsg = this.$t("upload.FAIL");
            this.$emit("crop-upload-fail", err, field, ki);
          }
        });
    },
    closeHandler(e) {
      if (this.value && (e.key === "Escape" || e.keyCode === 27)) {
        this.off();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@-webkit-keyframes vicp_progress {
  0% {
    background-position-y: 0;
  }
  100% {
    background-position-y: 40px;
  }
}
@keyframes vicp_progress {
  0% {
    background-position-y: 0;
  }
  100% {
    background-position-y: 40px;
  }
}
@-webkit-keyframes vicp {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) translatey(-60px);
    transform: scale(0) translatey(-60px);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) translatey(0);
    transform: scale(1) translatey(0);
  }
}
@keyframes vicp {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) translatey(-60px);
    transform: scale(0) translatey(-60px);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) translatey(0);
    transform: scale(1) translatey(0);
  }
}
.vue-image-crop-upload {
	.vicp-wrap {
		.vicp-step1 {
			.vicp-drop-area {
				position: relative;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				padding: 20px;
				height: 170px;
				background-color: #fafafa;
				text-align: center;
			  border: 1px dashed #d9d9d9;
				overflow: hidden;
				.vicp-icon1 {
					display: block;
					margin: 0 auto;
					width: 42px;
					overflow: hidden;
          color: #145C97;
          font-size: 48px;
				}
				.vicp-hint {
					display: block;
					color: rgba(0,0,0,.85);
          font-size: 16px;
					line-height: 30px;
				}
				.vicp-no-supported-hint {
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					padding: 30px;
					width: 100%;
					height: 60px;
					line-height: 30px;
					background-color: #eee;
					text-align: center;
					color: #666;
					font-size: 14px;
				}
				&:hover {
					cursor: pointer;
					    border-color: #145C97;
					background-color: rgba(0, 0, 0, 0.05);
				}
			}
		}
		.vicp-step2 {
			.vicp-crop {
				overflow: hidden;
				.vicp-crop-left {
					float: left;
					.vicp-img-container {
						position: relative;
						display: block;
						width: 240px;
						height: 180px;
						background-color: #e5e5e0;
						overflow: hidden;
						.vicp-img {
							position: absolute;
							display: block;
							cursor: move;
							-webkit-user-select: none;
							-moz-user-select: none;
							-ms-user-select: none;
							user-select: none;
						}
						.vicp-img-shade {
							-webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
							box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
							position: absolute;
							background-color: rgba(241, 242, 243, 0.8);
						}
						.vicp-img-shade.vicp-img-shade-1 {
							top: 0;
							left: 0;
						}
						.vicp-img-shade.vicp-img-shade-2 {
							bottom: 0;
							right: 0;
						}
					}
					.vicp-range {
						position: relative;
						margin: 20px 0 10px 0;
						width: 240px;
						padding: 1px;
						background-color: #F7F8F9;
            display: flex;
            button {
              margin: 0 5px;
            }
            .ant-slider {
              margin-left: 10px;
              width: 100%;
              ::v-deep .ant-slider-rail { 
                background-color: #d6dee2!important;
              }
            }
					}
				}
				.vicp-crop-right {
					float: right;
					.vicp-preview {
						height: 235px;
						overflow: hidden;
						.vicp-preview-item {
							position: relative;
							padding: 5px;
							width: 184px;
							height: 184px;
							float: left;
							span {
								position: absolute;
								bottom: -45px;
								width: 100%;
								font-size: 14px;
								color: #bbb;
								display: block;
								text-align: center;
							}
							img {
								position: absolute;
								display: block;
								top: 0;
								bottom: 0;
								left: 0;
								right: 0;
								margin: auto;
								padding: 3px;
								background-color: #fff;
								border: 1px solid rgba(0, 0, 0, 0.15);
								overflow: hidden;
								-webkit-user-select: none;
								-moz-user-select: none;
								-ms-user-select: none;
								user-select: none;
							}
						}
						.vicp-preview-item.vicp-preview-item-circle {
							margin-right: 0;
							img {
								border-radius: 100%;
							}
						}
					}
				}
			}
		}
		.vicp-step3 {
			.vicp-upload {
				position: relative;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				padding: 35px;
				height: 170px;
				background-color: #fafafa;
				text-align: center;
				border: 1px dashed #ddd;
				.vicp-loading {
					display: block;
					padding: 15px;
					font-size: 16px;
					color: #999;
					line-height: 30px;
				}
				.vicp-progress-wrap {
					margin-top: 12px;
					background-color: rgba(0, 0, 0, 0.08);
					border-radius: 3px;
					.vicp-progress {
						position: relative;
						display: block;
						height: 5px;
						border-radius: 3px;
						background-color: #52c41a;
						-webkit-box-shadow: 0 2px 6px 0 rgba(68, 170, 119, 0.3);
						box-shadow: 0 2px 6px 0 rgba(68, 170, 119, 0.3);
						-webkit-transition: width 0.15s linear;
						transition: width 0.15s linear;
						background-image: -webkit-linear-gradient( 135deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent );
						background-image: linear-gradient( -45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent );
						background-size: 40px 40px;
						-webkit-animation: vicp_progress 0.5s linear infinite;
						animation: vicp_progress 0.5s linear infinite;
						&::after {
							content: "";
							position: absolute;
							display: block;
							top: -3px;
							right: -3px;
							width: 9px;
							height: 9px;
							border: 1px solid rgba(245, 246, 247, 0.7);
							-webkit-box-shadow: 0 1px 4px 0 rgba(68, 170, 119, 0.7);
							box-shadow: 0 1px 4px 0 rgba(68, 170, 119, 0.7);
							border-radius: 100%;
							background-color: #52c41a;
						}
					}
				}
				.vicp-error {
					height: 100px;
					line-height: 100px;
				}
				.vicp-success {
					height: 100px;
					line-height: 100px;
				}
			}
		}
		.vicp-operate {
			margin-top: 20px;
			display: flex;
			flex-direction: row-reverse;
			.button-right { margin-left: auto;
		}
		.vicp-icon3 {
			position: relative;
			display: inline-block;
			width: 20px;
			height: 20px;
			top: 4px;
			&::after {
				position: absolute;
				top: 3px;
				left: 6px;
				width: 6px;
				height: 10px;
				border-width: 0 2px 2px 0;
				border-color: #52c41a;
				border-style: solid;
				-webkit-transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				transform: rotate(45deg);
				content: "";
			}
		}
	}
}
.vicp-error {
  color: #f5222d;
}
.vicp-icon2 {
	position: relative;
	display: inline-block;
	width: 20px;
	height: 20px;
  top: 4px;
	&::after {
		content: "";
		position: absolute;
		top: 9px;
		left: 4px;
		width: 13px;
		height: 2px;
		background-color: #f5222d;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
		-webkit-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}
	&::before {
		content: "";
		position: absolute;
		top: 9px;
		left: 4px;
		width: 13px;
		height: 2px;
		background-color: #f5222d;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}
}
.vue-image-crop-upload {
		.vicp-wrap {
			.vicp-success {
				color: #52c41a;
			}
		}
	}
}
</style>