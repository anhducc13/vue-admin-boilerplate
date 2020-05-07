<template>
  <div class="c-panel-2 header" :class="{ 'dark-header': darkHeader }">
    <div
      class="left-buttons"
      :class="{
        'div-after':
          showFilterButton ||
          (leftHeaderButtons && leftHeaderButtons.length > 0)
      }"
    >
      <a-tooltip v-if="showFilterButton" placement="top">
        <template slot="title">
          <span>{{ $t("tooltip.FILTER") }}</span>
        </template>
        <div @click="toggleFilter" class="filter-button" :class="{ active: showFilters }">
          <SvgIcon :src="'/assets/icons/filter.svg'" />
        </div>
      </a-tooltip>
      <div
        v-if="leftHeaderButtons && leftHeaderButtons.length > 0"
        class="custom-actions"
        :class="{ 'before-empty': !showFilterButton }"
      >
        <slot name="leftHeaderButtons"></slot>
      </div>
    </div>

    <div class="number-in-list" v-if="total > -1">
      <template v-if="total > offset && total > limit">
        <span class="highlighted-text">{{ getTableOffset }}</span>
        <span>{{ $t("shared.OF") }}</span>
      </template>
      <span class="highlighted-text">{{ total }}</span>
      <span>{{ $t("listHeader.RESULTS_LISTED") }}</span>
    </div>

    <div class="buttons">
      <div
        v-if="
          showFilterButton && statusQuickFilters && statusQuickFilters.length
        "
        class="quick-filter"
        :class="{ hidden: showFilters }"
      >
        <template v-for="filter in statusQuickFilters">
          <button
            :key="filter.value"
            :class="[{ selected: checkFilter(filter.value) }, filter.value]"
            class="buton-filter"
            @click="toggleQuickFilter(filter)"
          >{{ $t(translateStatus(filter.displayValue)) }}</button>
        </template>
      </div>
      <SelectRecord
        v-if="showRecord"
        :items="selectRecord"
        :selectedItem="getSeelctedItem"
        @onSelect="selectionRecord"
      />
      <slot name="buttons"></slot>

      <div v-if="allowGenerateCsv" class="default-dropdown">
        <a-dropdown :trigger="['click']" :placement="'bottomRight'">
          <a-menu slot="overlay" @click="onGenerateDownload">
            <a-menu-item :key="'xlsx'">
              <span class="mnu-icon">
                <SvgIcon :src="'/assets/icons/icon-download.svg'" />
              </span>
              <span>{{ $t("shared.DOWNLOAD_XLXS") }}</span>
            </a-menu-item>
            <a-menu-item :key="'csv'">
              <span class="mnu-icon">
                <SvgIcon :src="'/assets/icons/icon-download.svg'" />
              </span>
              <span>{{ $t("shared.DOWNLOAD_CSV") }}</span>
            </a-menu-item>
          </a-menu>
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ $t("shared.DOWNLOAD") }}</span>
            </template>
            <div>
              <SvgIcon :src="'/assets/icons/download.svg'" />
            </div>
          </a-tooltip>
        </a-dropdown>
      </div>

      <div class="default-dropdown">
        <a-dropdown :trigger="['click']" :placement="'bottomRight'">
          <a-menu slot="overlay">
            <template v-for="column in columns">
              <a-menu-item v-if="!column.fixed" :key="column.id">
                <div>
                  <a-checkbox
                    :key="column.id"
                    :checked="!column.hidden"
                    @change="onChangeHidden(column.id)"
                  >{{ column.header }}</a-checkbox>
                </div>
              </a-menu-item>
            </template>
          </a-menu>
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ $t("tooltip.COLUMNS") }}</span>
            </template>
            <div>
              <SvgIcon :src="'/assets/icons/news-grid.svg'" />
            </div>
          </a-tooltip>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "@/components/shared//SvgIcon";
import { configConstants } from "@/constants";
import SelectRecord from "./../../SelectRecord";
import * as _ from "lodash";

export default {
  name: "TableListHeader",
  props: {
    darkHeader: {
      type: Boolean,
      default: false
    },
    showFilterButton: {
      type: Boolean,
      default: false
    },
    showRecord: {
      type: Boolean,
      default: false
    },
    allowGenerateCsv: {
      type: Boolean,
      default: true
    },
    defaultShowFilter: {
      type: Boolean,
      default: false
    },
    statusQuickFilters: Array,
    columns: Array,
    total: Number,
    offset: Number,
    limit: Number,
    filters: Array,
    sortColumns: Array
  },
  components: {
    SvgIcon,
    SelectRecord
  },
  data() {
    return {
      showFilters: false,
      myComponents: null,
      leftHeaderButtons: [],
      selectRecord: configConstants.selectRecord,
      currentFilters: {},
      statusFilter: []
    };
  },
  created() {
    this.leftHeaderButtons = this.$slots && this.$slots.leftHeaderButtons;
    if (this.showFilterButton && this.defaultShowFilter) {
      this.showFilters = this.defaultShowFilter;
    }
    this.changeFilterMap();
  },
  methods: {
    checkFilter(str) {
      return this.statusFilter.find(s => s.value == str);
    },
    translateStatus(str) {
      const options = configConstants.translateStatus;
      return options[str] || str;
    },
    selectionRecord(value) {
      this.selectedItem = value;
      let limit;
      if (value > 0 && value !== this.limit) {
        limit = value;
        this.updateFilters(limit);
      } else if (this.limit !== this.total) {
        limit = this.total;
        this.updateFilters(limit);
      }
    },
    updateFilters(limit) {
      const currentFilters = _.clone(this.currentFilters);
      currentFilters["status"] = this.statusFilter.map(value => {
        value.disabled = false;
        return value;
      });
      const { sortColumns: sort } = this;
      this.$emit("requestItems", {
        offset: 0,
        limit: limit ? limit : this.limit,
        sort,
        filters: _.flatten(Object.values(currentFilters))
      });
    },
    onGenerateDownload(e) {
      const type = e.key;
      const fields = [];
      const displayNames = [];
      const fieldHeaders = [];
      this.columns.forEach(column => {
        if (column.id && column.header) {
          fields.push(column.id);
          displayNames.push(column.header);
          fieldHeaders.push({ field: column.id, displayName: column.header });
        }
      });
      const event = { type, fields, headers: displayNames, fieldHeaders };
      this.$emit("generateCsv", event);
    },
    changeFilterMap() {
      if (this.filters) {
        this.currentFilters = _.groupBy(this.filters, "columnId");
      } else {
        this.currentFilters = {};
      }
      this.statusFilter = this.currentFilters["status"] || [];
    },
    toggleFilter() {
      this.showFilters = !this.showFilters;
      this.$emit("toggleFilter", this.showFilters);
    },
    toggleQuickFilter(status) {
      if (this.statusFilter && this.statusFilter.length) {
        const hasStatus = this.statusFilter.find(s => s.value == status.value);
        if (hasStatus) {
          this.statusFilter = this.statusFilter.filter(
            sta => sta.value !== status.value
          );
        } else {
          this.statusFilter.push(status);
        }
      } else {
        this.statusFilter.push(status);
      }
      this.updateFilters();
    },
    onChangeHidden(columnId) {
      this.$emit("onChangeHidden", columnId);
    }
  },
  computed: {
    getSeelctedItem() {
      const { limit, total } = this;
      return limit !== total ? limit : this.$t("shared.ALL");
    },
    getTableOffset() {
      const { limit, total, offset } = this;
      return `${offset + 1}-${offset + limit < total ? offset + limit : total}`;
    }
  },
  watch: {
    filters(newVal, oldVal) {
      this.changeFilterMap();
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/everything.scss";
.header {
  width: 100%;
  height: 70px;
  margin: 0;
  padding-left: 30px;
  padding-right: 18px;
  display: flex;
  align-items: center;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  &.dark-header {
    background-color: $pale-grey-two;
  }
}

.buttons {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 18px;
  color: $greyish-brown;

  > * {
    margin-left: 18px;
  }

  .icon {
    font-size: 20px;
  }

  &:hover {
    cursor: pointer;
  }

  .open {
    color: $prepaird-orange;
  }
  .download-csv {
    cursor: pointer;
  }
}

.left-buttons {
  display: flex;
  margin-left: 2px;
  position: relative;
  margin-right: 36px;
}

.filter-button {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: $greyish-brown;
  margin-top: 2.5px;
  &:hover {
    cursor: pointer;
  }

  &.active {
    color: $prepaird-orange;
  }

  .plus-minus-icon {
    font-size: 10px;
  }

  &.active {
    svg-icon {
      ::ng-deep svg path {
        fill: $prepaird-purple;
      }
    }
  }
}

.custom-actions {
  &:not(.before-empty) {
    margin-left: 18px;
  }
}

.divider {
  width: 1px;
  height: 20px;
  background-color: $pale-grey;
  margin-right: 10px;
}

.number-in-list {
  color: $warm-grey-three;
  min-width: 180px;
  .highlighted-text {
    font-family: "Roboto-Medium";
    color: $light-eggplant-two;
    font-size: 14px;
  }

  font-size: 14px;
  font-family: "Roboto-Regular";
  text-transform: uppercase;
}

checkbox {
  & + span {
    padding-left: 5px;
  }
}

.quick-filter {
  margin: 15px;
  &.hidden {
    display: none;
  }
  .buton-filter {
    background-color: #e9edf1;
    border-radius: 2px;
    font-size: 10px;
    border: none;
    cursor: pointer;
    font-family: "Roboto-Regular";
    outline: none;
    padding: 0px 10px;
    margin: 1.5px 0px;
    height: 20px;
    line-height: 19px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    color: #354052;
    text-transform: uppercase;
    min-width: 60px;
    margin-left: 5px;
    &:hover {
      background: $prepaird-purple;
      color: $white;
    }

    &:active {
      background: $prepaird-purple;
      color: $white;
    }
    &.selected {
      background: $prepaird-purple;
      color: $white;
    }
  }
}

.default-dropdown {
  .item-download {
    padding: 8px 15px;
    cursor: pointer;
  }
  &:last-child {
    @media (max-width: $tablet-screen) {
      margin-right: 18px;
    }
  }
}

.div-after {
  &:after {
    content: "";
    display: block;
    width: 1px;
    height: 30px;
    background-color: #d8d8d8;
    position: absolute;
    right: -18px;
    top: -5px;
  }
}
</style>
