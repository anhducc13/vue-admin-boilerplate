<template>
  <div>
    <a-date-picker
      :disabled="disabled"
      v-model="dateValue"
      :format="dateFormat"
      @change="setValue"
      :style="{ width: '100%' }"
    ></a-date-picker>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ItemTableDateFilter",
  props: {
    column: Object,
    value: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateValue: this.value ? moment(parseInt(this.value)) : null,
      dateFormat: "DD/MM/YYYY",
      disabledColor: "#ccc",
      activeColor: "purple"
    };
  },
  methods: {
    setValue(date) {
      if (date) {
        const value = new Date(date).getTime();
        if (this.value !== value) {
          this.$emit("setFilter", {
            column: this.column,
            values: [this.toFilterOption(value)]
          });
        }
      } else {
        this.$emit("setFilter", {
          column: this.column,
          values: []
        });
      }
    },
    toFilterOption(value) {
      return {
        column: this.column,
        columnId: this.column.id,
        value: value,
        displayValue: null,
        disabled: false
      };
    }
  }
};
</script>

<style lang="scss">
.ant-tag {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  margin-bottom: 5px;
  .anticon-close {
    svg {
      display: block;
      font-size: 14px;
    }
  }
}
</style>
