<template>
  <div>
    <TableListHeader
      v-if="showHeaderBar"
      :total="total"
      :offset="offset"
      :limit="limit"
      :columns="columns"
      :sortColumns="sortColumns"
      :filters="filters"
      :statusQuickFilters="statusQuickFilters"
      :showFilterButton="showFilterButton"
      :darkHeader="darkHeader"
      :showRecord="showRecord"
      :allowGenerateCsv="allowGenerateCsv"
      :defaultShowFilter="showFilterRow"
      @toggleFilter="toggleShowFilter"
      @generateCsv="$emit('generateCsv', $event)"
      @requestItems="requestItems"
      @onChangeHidden="$emit('onChangeHidden', $event)"
    >
      <template slot="leftHeaderButtons">
        <slot name="leftHeaderButtons"></slot>
      </template>

      <template slot="buttons">
        <slot name="buttons"></slot>
      </template>
    </TableListHeader>

    <TableList
      :items="items"
      :columns="columns"
      :sortColumns="sortColumns"
      :filters="filters"
      :loadingTableData="loadingTableData"
      :displayFooter="displayFooter"
      :showFilterRow="showFilterRow"
      :currentFilters="currentFilters"
      :checkable="checkable"
      :attributeNameChecked="attributeNameChecked"
      @toggleFilter="toggleActionFilter"
      @requestItems="requestItems"
      @onDragColumns="$emit('onDragColumns', $event)"
    >
      <template slot="noItemsTmpl">
        <slot name="noItemsTmpl"></slot>
      </template>

      <template v-for="column in columns" :slot="column.headerTemplateRef">
        <slot :name="column.headerTemplateRef"></slot>
      </template>

      <template v-for="column in columns" :slot="column.id" slot-scope="{ item, isSelf, data }">
        <slot :name="column.id" :item="item" :isSelf="isSelf" :data="data"></slot>
      </template>

      <template slot="filterRowTmpl" slot-scope="{ columns }">
        <tr
          v-if="showFilterRow"
          class="filter-row"
          :class="{
            top: filterRowAlignV === 'top',
            bottom: filterRowAlignV === 'bottom'
          }"
        >
          <td v-if="checkable" />
          <td v-for="column in columns" :key="column.id" :hidden="column.hidden">
            <ItemTableAutoCompleteFilter
              v-if="column.filter && column.filter.type === 'auto-complete'"
              :positionListValue="filterRowAlignV === 'top' ? 'bottom' : 'top'"
              :column="column"
              :values="currentFilters[column.id]"
              @setFilter="setFilter"
            ></ItemTableAutoCompleteFilter>
            <ItemTableBooleanFilter
              v-if="column.filter && column.filter.type === 'boolean'"
              :column="column"
              :value="valueFilter(column.id, currentFilters)"
              :disabled="disabledFilter(column.id, currentFilters)"
              @setFilter="setFilter"
            ></ItemTableBooleanFilter>
            <ItemTableDateFilter
              v-if="column.filter && column.filter.type === 'date'"
              :column="column"
              :positionListValue="filterRowAlignV === 'top' ? 'bottom' : 'top'"
              :value="valueFilter(column.id, currentFilters)"
              :disabled="disabledFilter(column.id, currentFilters)"
              @setFilter="setFilter"
            ></ItemTableDateFilter>
            <ItemTableSearchFilter
              v-if="column.filter && column.filter.type === 'search'"
              :column="column"
              :value="valueFilter(column.id, currentFilters)"
              :disabled="disabledFilter(column.id, currentFilters)"
              @setFilter="setFilter"
            ></ItemTableSearchFilter>
          </td>
        </tr>
      </template>
    </TableList>
  </div>
</template>

<script>
import TableListHeader from "./../TableListHeader";
import TableList from "./../TableList";
import ItemTableAutoCompleteFilter from "./../ItemTableAutoCompleteFilter";
import ItemTableBooleanFilter from "./../ItemTableBooleanFilter";
import ItemTableDateFilter from "./../ItemTableDateFilter";
import ItemTableSearchFilter from "../ItemTableSearchFilter";
import * as _ from "lodash";

export default {
  name: "ItemTable",
  props: {
    tableTitle: String,
    items: Object,
    columns: Array,
    placeholder: {
      type: String,
      default: "shared.DEFAULT_TABLE_LIST_PLACEHOLDER"
    },
    sortColumns: Array,
    filters: Array,
    statusQuickFilters: Array,
    loadingTableData: {
      type: Boolean,
      default: false
    },
    showFilterButton: {
      type: Boolean,
      default: false
    },
    showHeaderBar: {
      type: Boolean,
      default: true
    },
    displayFooter: {
      type: Boolean,
      default: true
    },
    darkHeader: {
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
    filterRowAlignV: {
      type: String,
      default: "middle"
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    attributeNameChecked: {
      type: String,
      default: "checked",
    }
  },
  components: {
    TableListHeader,
    TableList,
    ItemTableAutoCompleteFilter,
    ItemTableBooleanFilter,
    ItemTableDateFilter,
    ItemTableSearchFilter
  },
  data() {
    return {
      limit: null,
      offset: null,
      total: null,
      showFilterRow: false,
      currentFilters: {}
    };
  },
  created() {
    this.initialChecked();
    this.changeDataTable();
    this.changeFilterMap();
    if (this.filters && this.filters.length !== 0 && this.showFilterButton) {
      const noStatus = this.filters.filter(
        fitler => fitler.columnId !== "status"
      );
      this.showFilterRow = !!noStatus.length;
    }
  },
  methods: {
    initialChecked() {
      if (this.items && this.items.data) {
        this.items.data = this.items.data.map(ele => ({
          ...ele,
          [this.attributeNameChecked]: false,
        }));
      }
    },
    changeDataTable() {
      if (this.items && this.items.pagination) {
        const { pagination } = this.items;
        this.offset = pagination.offset;
        this.limit = pagination.limit;
        this.total = pagination.total;
      }
    },
    toggleShowFilter(e) {
      this.showFilterRow = e;
    },
    setFilter(data) {
      const { column, values } = data;
      this.$set(this.currentFilters, column.id, values);
      this.updateFilters(column, this.currentFilters[column.id]);
    },
    updateFilters(column, values) {
      const currentFilters = _.clone(this.currentFilters);
      currentFilters[column.id] = values.map(value => {
        value.disabled = false;
        return value;
      });
      const { limit, sortColumns } = this;
      this.requestItems({
        offset: 0,
        limit,
        sort: sortColumns,
        filters: _.flatten(Object.values(currentFilters))
      });
    },
    requestItems({ offset, limit, sort, filters }) {
      this.$emit("dataRequest", {
        offset: offset,
        limit: limit,
        sort: sort,
        filters: filters
      });
    },
    toggleActionFilter(column) {
      const filtersMap = this.currentFilters[column.id];
      if (filtersMap) {
        this.currentFilters[column.id] = filtersMap.map(filter => {
          filter.disabled = !filter.disabled;
          return filter;
        });
        const { limit, sortColumns, filters } = this;
        this.requestItems({ offset: 0, limit, sort: sortColumns, filters });
      }
    },
    changeFilterMap() {
      if (this.filters && this.filters.length !== 0) {
        this.currentFilters = _.groupBy(this.filters, "columnId");
      } else {
        this.currentFilters = {};
      }
    }
  },
  computed: {
    colsDisplayed() {
      return this.columns.filter(x => {
        return x.hidden !== true;
      }).length;
    },
    valueFilter() {
      return (id, currentFilters) => {
        const currFilter = currentFilters[id];
        if (currFilter && currFilter.length) {
          return currFilter[0].value;
        }
        return null;
      };
    },
    valuesFilterDate() {
      return (id, currentFilters) => {
        const currFilter = currentFilters[id];
        if (currFilter && currFilter.length) {
          return currFilter.map(f => ({
            value: f.value,
            disabled: f.disabled
          }));
        }
        return [];
      };
    },
    disabledFilter() {
      return (id, currentFilters) => {
        const currFilter = currentFilters[id];
        if (currFilter && currFilter.length) {
          return currFilter[0].disabled;
        }
        return false;
      };
    }
  },
  watch: {
    items(newVal, oldVal) {
      this.changeDataTable();
    },
    filters(newVal, oldVal) {
      this.changeFilterMap();
    }
  }
};
</script>

<style></style>
