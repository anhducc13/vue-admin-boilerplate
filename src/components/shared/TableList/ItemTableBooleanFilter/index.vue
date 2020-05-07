<template>
  <b-container :class="{ disabled: disabled }">
    <div
      class="fa fa-check icon true"
      :class="{ active: value === true }"
      @click="setTrue()"
    ></div>
    <div
      class="fa fa-times icon false"
      :class="{ active: value === false }"
      @click="setFalse()"
    ></div>
    <div class="fa fa-minus icon clear" @click="clear()"></div>
  </b-container>
</template>

<script>
export default {
  name: "ItemTableBooleanFilter",
  props: {
    column: Object,
    value: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setTrue() {
      this.setValue(true);
    },
    setFalse() {
      this.setValue(false);
    },
    clear() {
      this.setValue(null);
    },
    setValue(value) {
      if (this.value !== value) {
        if (value !== null) {
          this.$emit("setFilter", {
            column: this.column,
            values: [this.toFilterOption(value)]
          });
        } else {
          this.$emit("setFilter", {
            column: this.column,
            values: []
          });
        }
      }
    },
    toFilterOption(value) {
      return {
        columnId: this.column.id,
        value: value,
        displayValue: null,
        disabled: false
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/everything.scss";
.container {
  display: flex;

  &.disabled .icon.active {
    background-color: $light-grey !important;
    color: $white;
  }
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 17px;
  border: 1px solid $white-four;
  font-size: 10px;
  cursor: pointer;

  &:first-child {
    border-right: 0;
  }

  &:last-child {
    border-left: 0;
  }

  &.active {
    background-color: $rusty-orange;
    color: $white;
  }
}
</style>
