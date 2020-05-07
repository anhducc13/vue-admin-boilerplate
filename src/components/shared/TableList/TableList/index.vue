<template>
  <div>
    <table class="c-panel-2 list">
      <draggable
        v-model="dragColumns"
        tag="thead"
        v-bind="dragTransition"
        :move="onDragMove"
        @start="onDragStart"
        draggable=".draggable"
        @end="onDragEnd"
      >
        <th v-if="checkable">
          <a-checkbox
            @change="changeCheckedAll"
            :checked="isCheckAll"
            :indeterminate="isIndeterminate"
          />
        </th>
        <th
          v-for="column in columns"
          :class="{
            draggable: !column.fixed,
            dragged:
              columnMap[column.id] && columnMap[column.id]._dragged && dragmode,
            hovered:
              columnMap[column.id] && columnMap[column.id]._hovered && dragmode,
            sorted: currentSortMap[column.id],
            filtered:
              currentFilters[column.id] &&
              currentFilters[column.id].length &&
              !currentFilters[column.id][0].disabled
          }"
          :key="column.id"
          :hidden="column.hidden"
          :id="column.id"
          :style="{ width: column.width || 'auto' }"
        >
          <div class="list-header">
            <div v-if="column.headerTemplateRef">
              <slot :name="column.headerTemplateRef" :item="column"></slot>
            </div>
            <div v-else class="t-table-column-header header-name">{{ column.header }}</div>

            <div class="column-header-icons">
              <div
                v-if="column.filter && currentFilters[column.id]"
                class="filter-icon"
                :class="{
                  disabled:
                    currentFilters[column.id][0] &&
                    currentFilters[column.id][0].disabled
                }"
                @click="toggleFilter(column)"
              >
                <span class="fa fa-filter"></span>
              </div>
              <div
                v-if="column.sortable"
                class="sort-icon"
                :class="{ active: currentSortMap[column.id] }"
                @click="sortColumn(column)"
              >
                <template v-if="currentSortMap[column.id]">
                  <span v-if="currentSortMap[column.id].order === 'asc'" class="fa fa-caret-up"></span>
                  <span v-if="currentSortMap[column.id].order === 'desc'" class="fa fa-caret-down"></span>
                </template>
                <template v-else>
                  <span class="fa fa-caret-up up"></span>
                  <span class="fa fa-caret-down down"></span>
                </template>
              </div>
            </div>
          </div>
        </th>
      </draggable>

      <tbody>
        <div v-if="loadingTableData" class="table-loader">
          <div class="loader"></div>
        </div>
        <template v-if="actualItems.data && actualItems.data.length > 0">
          <slot name="filterRowTmpl" :columns="columns"></slot>
          <tr v-for="item in actualItems.data" :key="item.id" class="row-content">
            <td v-if="checkable">
              <a-checkbox
                :checked="item[attributeNameChecked]"
                @change="e => checkedSingleItem(item.id, e.target.checked)"
              />
            </td>
            <td
              v-for="column in columns"
              :hidden="column.hidden"
              :key="column.id"
              :data-columnid="column.id"
              :class="{
                dragged:
                  columnMap[column.id] &&
                  columnMap[column.id]._dragged &&
                  dragmode,
                hovered:
                  columnMap[column.id] &&
                  columnMap[column.id]._hovered &&
                  dragmode
              }"
            >
              <slot :name="column.id" :item="item" :isSelf="column.isSelf" :data="actualItems.data"></slot>
            </td>
          </tr>
        </template>

        <template v-else>
          <slot name="filterRowTmpl" :columns="columns"></slot>
          <tr v-if="!loadingTableData" class="row-content">
            <td :colspan="columns.length">
              <span v-if="!noItemsTmpl">{{ $t(placeholder) }}</span>
              <div v-if="noItemsTmpl">
                <slot name="noItemsTmpl"></slot>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-if="displayFooter && actualItems.data && actualItems.data.length > 0">
      <div class="table-footer" :colspan="columns.length">
        <div class="table-footer-container">
          <div
            v-if="currentPage !== 1 && nrOfPages > 1"
            class="fa fa-caret-left page-arrow-left"
            @click="goToPage(currentPage - 1)"
          ></div>
          <div class="current-page">
            <span class="items">{{ getTablePagination }}</span>
            <span class="of">{{ $t("shared.OF") }}</span>
            <span class="items">{{ total }}</span>
          </div>
          <div
            v-if="currentPage !== nrOfPages && nrOfPages > 1"
            class="fa fa-caret-right page-arrow-right"
            @click="goToPage(currentPage + 1)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "TableList",
  props: {
    items: Object,
    columns: Array,
    placeholder: {
      type: String,
      default: "shared.DEFAULT_TABLE_LIST_PLACEHOLDER"
    },
    sortColumns: Array,
    loadingTableData: {
      type: Boolean,
      default: false
    },
    showFilterRow: {
      type: Boolean,
      default: false
    },
    displayFooter: {
      type: Boolean,
      default: false
    },
    currentFilters: Object,
    checkable: {
      type: Boolean,
      required: true,
    },
    attributeNameChecked: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      currentSortMap: {},
      actualItems: {},
      limit: null,
      offset: null,
      total: null,
      currentPage: 1,
      nrOfPages: 1,
      noItemsTmpl: null,
      dragmode: false,
      columnMap: {}
    };
  },
  components: {
    draggable
  },
  created() {
    this.changeDataTable();
    this.changeSortMap();
    this.noItemsTmpl = this.$slots && this.$slots.noItemsTmpl;
  },
  methods: {
    checkedSingleItem(id, newChecked) {
      if (this.items && this.items.data) {
        this.items.data = this.items.data.map(ele => {
          if (ele.id === id) {
            ele.checked = newChecked;
          }
          return ele;
      });
      }
    },
    changeCheckedAll(e) {
      const newChecked = e.target.checked;
      this.items.data = this.items.data.map(ele => ({
        ...ele,
        checked: newChecked,
      }));
    },
    toggleFilter(column) {
      this.$emit("toggleFilter", column);
    },
    sortColumn(column) {
      const existingSort =
        (this.sortColumns &&
          this.sortColumns.find(sort => column.id === sort.columnId)) ||
        {};
      const { offset, limit, currentFilters } = this;
      const sort = [
        {
          columnId: column.id,
          order: existingSort.order === "asc" ? "desc" : "asc"
        }
      ];
      this.$emit("requestItems", {
        offset,
        limit,
        sort,
        filters: _.flatten(Object.values(currentFilters))
      });
    },
    goToPage(pageNr) {
      const offset = (pageNr - 1) * this.limit;
      const { limit, sortColumns: sort, currentFilters: filters } = this;
      this.$emit("requestItems", {
        offset,
        limit,
        sort,
        filters: _.flatten(Object.values(currentFilters))
      });
    },
    updateFooter() {
      const pagination = this.actualItems.pagination;
      this.currentPage =
        pagination.offset !== 0
          ? Math.ceil(pagination.offset / pagination.limit) + 1
          : 1;
      this.nrOfPages = Math.ceil(pagination.total / pagination.limit);
    },
    changeDataTable() {
      if (this.items) {
        if (this.items.data) {
          this.actualItems = this.items;
          if (this.displayFooter) {
            this.updateFooter();
          }
        } else {
          this.actualItems = {
            data: this.items,
            pagination: {}
          };
        }
        this.total = this.actualItems.pagination.total;
        this.offset = this.actualItems.pagination.offset;
        this.limit = this.actualItems.pagination.limit;
      }
    },
    changeSortMap() {
      if (this.sortColumns && this.sortColumns.length !== 0) {
        this.currentSortMap = _.keyBy(this.sortColumns, "columnId");
      } else {
        this.currentSortMap = {};
      }
    },
    onDragStart(data) {
      this.dragmode = true;
    },
    onDragEnd() {
      this.dragmode = false;
      this.columns.forEach((column, index) => {
        if (this.columnMap[column.id]) {
          this.columnMap[column.id]._hovered = false;
          this.columnMap[column.id]._dragged = false;
        }
      });
    },
    onDragMove(event) {
      const { draggedContext, relatedContext } = event;
      this.$set(this.columnMap, draggedContext.element.id, { _dragged: true });
      this.columns.forEach((column, index) => {
        if (this.columnMap[column.id]) {
          this.columnMap[column.id]._hovered = false;
        }
      });
      this.$set(this.columnMap, relatedContext.element.id, { _hovered: true });
    }
  },
  computed: {
    isCheckAll() {
      const { data } = this.items;
      if (data && data.length) {
        return data.every(ele => ele[this.attributeNameChecked]);
      }
      return false;
    },
    isIndeterminate() {
      const { data } = this.items;
      if (data && data.length) {
        return !data.every(ele => !ele[this.attributeNameChecked]) && !this.isCheckAll;
      }
      return false;
    },
    getTablePagination() {
      const { limit, total, offset } = this;
      return `${offset + 1}-${offset + limit < total ? offset + limit : total}`;
    },
    dragColumns: {
      get() {
        return this.columns;
      },
      set(columns) {
        this.$emit("onDragColumns", columns);
      }
    },
    dragTransition() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  watch: {
    items(newVal, oldVal) {
      this.changeDataTable();
    },
    sortColumns(newVal, oldVal) {
      this.changeSortMap();
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/everything.scss";
$padding: 7px;
.hovered {
  background-color: $panel-edit-color;
  outline: 1px dashed $panel-border-color;

  &.hover {
    background-color: $panel-edit-color !important;
  }
}

table {
  position: relative;
  min-height: 110px;
  $padding: 7px;
  margin: 0 0 $padding 0;
  border-collapse: collapse;
  width: 100%;
  background-color: $white;
  border-top: 0;

  .table-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($white, 0.9);
    z-index: 9999;
    border: 1px solid $panel-border-color;
    z-index: 1;

    .loader {
      margin-top: 50px;
    }
  }
}

.dragged {
  background-color: $panel-edit-color;
  outline: 1px dashed $panel-border-color;

  &.hover {
    background-color: $panel-edit-color !important;
  }
}

thead {
  border-top: 1px solid $panel-border-color;
}

th {
  margin: 0;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
  padding: $padding 16px;
  border-bottom: 1px solid $panel-border-color;

  &.drag {
    color: $dark-gray;
  }

  &.draggable {
    &:hover {
      background-color: $list-item-hover-background-color;
    }
  }

  &.draggable {
    cursor: move;
  }

  &.sorted,
  &.filtered {
    .t-table-column-header {
      color: $light-eggplant-two;
    }
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-name {
      margin-right: auto;
      font-family: "Roboto-Medium";
    }

    .column-header-icons {
      display: flex;

      .filter-icon,
      .sort-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 20px;
        width: 20px;
        color: $charcoal-grey;
        font-size: 10px;
        cursor: pointer;
      }

      .filter-icon {
        color: $light-eggplant-two;

        &.disabled {
          color: $light-grey;
        }
      }

      .sort-icon {
        &.active {
          color: $light-eggplant-two;
        }

        .down {
          margin-top: -3px;
        }
      }
    }
  }
}

tbody tr {
  @media (max-width: $small-screen) {
  }

  .show-on-hover {
    visibility: hidden;
  }

  &.row-content {
    &:hover {
      background-color: $list-item-hover-background-color;

      .show-on-hover {
        visibility: visible;
      }
    }

    td {
      height: 82px;
      padding: 9px 16px;
      border-bottom: solid 1px $panel-border-color;
    }
  }

  &.filter-row {
    background-color: $pale-grey-two;
    &.last-row {
      td {
        border-bottom: solid 1px $panel-border-color;
      }
    }
    td {
      padding: 8px 16px;
    }
    &.top {
      td {
        vertical-align: top;
      }
    }

    &.bottom {
      td {
        vertical-align: bottom;
      }
    }
  }

  &:last-child td {
    border: 0;
  }
}

.table-footer {
  display: flex;
  justify-content: center;

  .table-footer-container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-family: "Roboto-Regular";
    font-size: 14px;
    background-color: $white;
    margin-top: 12px;

    .page-arrow-right {
      margin-left: 12px;
    }

    .page-arrow-left {
      margin-right: 12px;
    }

    .page-arrow-left,
    .page-arrow-right {
      font-size: 20px;
      cursor: pointer;

      &:hover {
        color: $dark-sky-blue;
      }
    }

    .items {
      font-family: "Roboto-Medium";
      color: $light-eggplant-two;
      font-size: 14px;
    }

    .of {
      font-family: "Roboto-Regular";
    }
  }
}

.filter-single-row {
  > * {
    margin-top: 10px;
  }

  item-table-auto-complete-filter {
    ::ng-deep {
      .value-container {
        max-width: inherit !important;
        position: relative;
        padding-top: 15px;
      }
    }
  }

  .row-title {
    border-top: 1px solid $light-grey;
    text-align: center;
    span {
      margin-top: -10px;
      position: absolute;
      left: 0;
      right: 0;
      color: $warm-grey-four;
      background-color: $pale-grey-two;
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
      padding-left: 6px;
      padding-right: 6px;
    }
  }
}
@media only screen and (max-width: 1500px) {
  th,
  tr,
  td {
    white-space: normal;
    font-size: 14px !important;
  }
  td {
    padding: 4px 8px;
  }
}
</style>
