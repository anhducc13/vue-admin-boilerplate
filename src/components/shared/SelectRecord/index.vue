<template>
  <a-dropdown :trigger="['click']">
    <a-menu slot="overlay" @click="select">
      <template v-for="item in items">
        <a-menu-item :key="item.value">{{
          item.value === -1 ? $t(item.label) : item.label
        }}</a-menu-item>
      </template>
    </a-menu>
    <div class="group-select">
      <span>{{ $t("shared.SHOW") }}</span>
      <div class="input" :class="{ disabled: disabled }">
        <div v-if="selectedItem" class="selected-item">
          <template>
            <span>{{ selectedItem }}</span>
          </template>
        </div>
        <div class="icon">
          <span class="fa fa-caret-up"></span>
          <span class="fa fa-caret-down down"></span>
        </div>
      </div>
    </div>
  </a-dropdown>
</template>

<script>
export default {
  name: "SelctRecord",
  props: {
    items: Array,
    placeholder: String,
    selectedItem: {
      type: [Number, String],
      default: 25
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    select(e) {
      this.$emit("onSelect", e.key);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/everything.scss";
.group-select {
  display: flex;
  height: 36px;
  line-height: 36px;
  min-width: 130px;
  cursor: pointer;
  color: #818181;
  font-size: 14px;
  font-family: "Roboto-Regular";
  .input {
    @include default-input-button;
    display: inline-flex;
    height: 100%;
    align-items: center;
    padding: 10px 13px 10px 16px;
    margin: 0px 10px;
    .selected-item {
      padding-right: 10px;
    }
  }

  .placeholder {
    color: $input-placeholder-color;
    opacity: 0.4;
  }

  .icon {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    font-size: 10px !important;
    color: $charcoal-grey;

    .down {
      margin-top: -3px;
    }
  }

  .option {
    &.small {
      padding: 10px 0;
      text-align: center;
    }
  }

  .selected-item {
    width: 100%;
  }
}
</style>
