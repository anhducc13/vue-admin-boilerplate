<template>
  <div>
    <div
      :class="{
        'filter-container': true,
        top: positionListValue === 'top',
        bottom: positionListValue === 'bottom'
      }"
    >
      <div
        class="value-container"
        :class="{ top: positionListValue === 'top' }"
        v-if="values && positionListValue === 'top'"
      >
        <template v-for="(value, index) in values">
          <a-tag
            :color="disabled ? disabledColor : activeColor"
            :key="index"
            :closable="true"
            @close.prevent="onRemove(value)"
          >
            {{ $t(translateStatus(value.displayValue)) }}
          </a-tag>
          <!-- <div :key="index" > {{ $t(translateStatus(value.displayValue)) }}</div> -->
        </template>
      </div>
      <a-auto-complete
        class="auto-complete"
        :placeholder="column.filter.placeholder"
        :value="resetValue"
        @search="handleSearch"
        @select="onSelect"
      >
        <template slot="dataSource">
          <a-select-option
            v-for="item in dataSource"
            :key="item.id.toString()"
            >{{ item.displayValue }}</a-select-option
          >
        </template>
      </a-auto-complete>
    </div>
    <div
      class="value-container"
      :class="{ bottom: positionListValue === 'bottom' }"
      v-if="values && positionListValue === 'bottom'"
    >
      <template v-for="(value, index) in values">
        <a-tag
          :color="disabled ? disabledColor : activeColor"
          :key="index"
          :closable="true"
          @close.prevent="onRemove(value)"
        >
          {{ $t(translateStatus(value.displayValue)) }}
        </a-tag>
      </template>
    </div>
  </div>
</template>

<script>
import { configConstants } from "@/constants";
import * as _ from "lodash";

export default {
  name: "ItemTableAutoCompleteFilter",
  props: {
    column: Object,
    values: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: String,
    positionListValue: {
      type: String,
      default: "bottom"
    }
  },
  data() {
    return {
      disabled: false,
      disabledColor: "#ccc",
      activeColor: "purple",
      dataSource: [],
      resetValue: ""
    };
  },
  methods: {
    translateStatus(str) {
      let status;
      if (str) {
        status = str.toLowerCase();
      }
      const options = configConstants.translateStatus;
      return options[status] || str;
    },
    handleSearch: _.debounce(async function(query) {
      this.dataSource = await this.column.filter.dataSource(query);
    }, 500),
    onSelect(value) {
      const values = _.clone(this.values);
      const item = this.dataSource.filter(item => item.id.toString() === value);
      if (item && item.length > 0) {
        values.push(this.toFilterOption(item[0]));
        this.$emit("setFilter", {
          column: this.column,
          values
        });
      }
      this.resetValue = "";
    },
    onRemove(item) {
      let values = _.clone(this.values);
      values = values.filter(vitem => vitem.value !== item.value);
      this.$emit("setFilter", {
        column: this.column,
        values
      });
    },
    toFilterOption(value) {
      return {
        columnId: this.column.id,
        value: value.value,
        displayValue: value.displayValue,
        disabled: false
      };
    }
  },
  watch: {
    values(newVal, oldVal) {
      this.values = this.values || [];
      this.disabled = (this.values[0] && this.values[0].disabled) || false;
    }
  }
};
</script>

<style lang="scss">
.value-container {
  max-width: 200px;
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
}
.auto-complete {
  width: 100%;
}
</style>
