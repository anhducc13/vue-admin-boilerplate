<template>
  <a-input-search
    v-model="inputValue"
    :disabled="disabled"
    :placeholder="$t('shared.ENTER_KEYWORD')"
    @search="setValue"
    @blur="handleBlur"
  >
    <a-icon
      :title="$t('shared.RESET')"
      class="cursor-pointer"
      slot="addonAfter"
      type="sync"
      @click="() => setValue(null)"
    />
  </a-input-search>
</template>

<script>
export default {
  name: "ItemTableSearchFilter",
  props: {
    column: Object,
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: this.value
    };
  },
  methods: {
    setValue(value) {
      if (this.value === value || (this.value === null && value === "")) {
        return;
      }
      this.inputValue = value;
      if (value) {
        this.$emit("setFilter", {
          column: this.column,
          values: [
            {
              columnId: this.column.id,
              value,
              displayValue: null,
              disabled: false
            }
          ]
        });
      } else {
        this.$emit("setFilter", {
          column: this.column,
          values: []
        });
      }
    },
    handleBlur(e) {
      this.setValue(e.target.value);
    }
  }
};
</script>
<style scoped lang="scss">
.anticon {
  vertical-align: 0.125em !important;
}
</style>
