<template>
  <a-card>
    <h2>{{$t('role.ROLE_LIST')}}</h2>
    <ItemTable
      checkable
      attributeNameChecked="checked"
      :showFilterButton="true"
      :statusQuickFilters="statusQuickFilters"
      :showRecord="true"
      :columns="columns"
      :items="items"
      :loadingTableData="roleFetching"
      :sortColumns="activeSorters"
      :filters="activeFilters"
      @generateCsv="generateCsv"
      @dataRequest="requestPositions"
      @onDragColumns="onDragColumns"
      @onChangeHidden="onChangeHidden"
    >
      <template slot="leftHeaderButtons">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item @click="handleDeleteMulti()">{{ $t('role.DELETE_ROLE_SELECTED') }}</a-menu-item>
          </a-menu>
          <div>
            <SvgIcon :src="'/assets/icons/more-action.svg'" />
          </div>
        </a-dropdown>
      </template>
      <template slot="buttons">
        <a-button type="primary" @click="jumpToCreatePage">{{$t('role.ADD_NEW_ROLE')}}</a-button>
      </template>

      <template slot="id" slot-scope="{ item }">
        <span>{{ item.id }}</span>
      </template>

      <template slot="name" slot-scope="{ item }">
        <span>{{ item.name }}</span>
      </template>

      <template slot="roleAcp" slot-scope="{ item }">
        <a-switch size="small" :checked="item.roleAcp" />
      </template>

      <template slot="defaultSignUp" slot-scope="{ item }">
        <a-switch size="small" :checked="item.defaultSignUp" />
      </template>

      <template slot="status" slot-scope="{ item }">
        <a-tag :color="item.status === 'ACTIVE' ? 'green' : 'red'">{{ item.status }}</a-tag>
      </template>

      <template slot="createdAt" slot-scope="{ item }">
        <span>{{ item.createdAt | dateFormat('DD-MM-YYYY') }}</span>
      </template>

      <template slot="updatedAt" slot-scope="{ item }">
        <span>{{ item.updatedAt | dateFormat('DD-MM-YYYY') }}</span>
      </template>

      <template slot="moreActions" slot-scope="{ item }">
        <a-dropdown>
          <span class="fa fa-ellipsis-h more" />
          <a-menu slot="overlay">
            <a-menu-item key="2" @click="jumpToDetailPage(item.id)">{{ $t('shared.VIEW') }}</a-menu-item>
            <a-menu-item key="0" @click="jumpToEditPage(item.id)">{{ $t('shared.EDIT') }}</a-menu-item>
            <a-menu-item key="1" @click="handleDelete(item.id)">{{ $t('shared.DELETE') }}</a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </ItemTable>
  </a-card>
</template>

<script>
import ItemTable from "@/components/shared//TableList/ItemTable";
import SvgIcon from "@/components/shared//SvgIcon";
import * as _ from "lodash";
import {
  serializeSortOptions,
  serializeFilters,
  deserializeSortOptions,
  deserializeFilters,
  toFilterOptions,
  toSortOptions
} from "@/components/shared//TableList/TableListHelper";
import { Url } from "@/helpers";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "RoleList",
  components: {
    ItemTable,
    SvgIcon
  },
  data() {
    return {
      columnIdToFilterName: {},
      columnIdToSortName: {},
      statusQuickFilters: [
        {
          columnId: "status",
          value: "ACTIVE",
          displayValue: "shared.ACTIVE"
        },
        {
          columnId: "status",
          value: "INACTIVE",
          displayValue: "shared.INACTIVE"
        }
      ],
      columns: [
        {
          id: "checkbox",
          fixed: true,
          header: "",
          headerTemplateRef: "selectAllRoles"
        },
        {
          id: "id",
          sortable: true,
          header: "Id"
        },
        {
          id: "name",
          sortable: true,
          header: this.$t("role.NAME"),
          filter: {
            type: "search"
          }
        },
        {
          id: "roleAcp",
          sortable: true,
          header: this.$t("role.ROLE_ACP"),
          filter: {
            type: "boolean"
          }
        },
        {
          id: "defaultSignUp",
          hidden: true,
          sortable: true,
          header: this.$t("role.DEFAULT_SIGNUP"),
          filter: {
            type: "boolean"
          }
        },
        {
          id: "status",
          sortable: true,
          header: this.$t("role.STATUS"),
          filter: {
            type: "search"
          }
        },
        {
          id: "createdAt",
          hidden: true,
          sortable: true,
          header: this.$t("role.CREATED_AT")
        },
        {
          id: "updatedAt",
          hidden: true,
          sortable: true,
          header: this.$t("role.UPDATED_AT")
        },
        {
          id: "moreActions",
          fixed: true,
          header: ""
        }
      ],
      items: {},
      activeFilters: [],
      activeSorters: []
    };
  },
  methods: {
    ...mapActions("moduleAdmin/role", [
      "getRoles",
      "deleteRole",
      "deleteRoles"
    ]),
    generateCsv(event) {
      // console.log(event);
      // debugger;
    },
    jumpToEditPage(id) {
      const path = Url.create("/admin/roles/{id}/edit", { id });
      this.$router.push({ path });
    },
    jumpToDetailPage(id) {
      const path = Url.create("/admin/roles/{id}", { id });
      this.$router.push({ path });
    },
    jumpToCreatePage() {
      this.$router.push({ path: `/admin/roles/create` });
    },
    handleDelete(id) {
      this.$confirm({
        title: this.$t("shared.CONFIRM"),
        content: this.$t("shared.DO_YOU_WANT_DELETE_THIS_RECORD"),
        onOk: async () => {
          await this.deleteRole(id);
          this.reloadRolesByRouteParams(this.$route.query);
          if (!this.roleError) {
            this.$notification.success({
              message: this.$t("shared.DELETE_SUCCESS")
            });
          }
        }
      });
    },
    async handleDeleteMulti() {
      this.$confirm({
        title: this.$t("shared.CONFIRM"),
        content: this.$t("role.DELETE_ROLE_SELECTED"),
        onOk: async () => {
          const roleIds = this.items.data
            .filter(ele => ele["checked"])
            .map(ele => ele.id);
          if (!roleIds.length) {
            this.$message.warning(
              this.$t("role.PLEASE_SELECT_AT_LEAST_ONE_ROLE")
            );
          }
          await this.deleteRoles(roleIds);
          this.reloadRolesByRouteParams(this.$route.query);
          if (!this.roleError) {
            this.$notification.success({
              message: this.$t("shared.DELETE_SUCCESS")
            });
          }
        }
      });
    },
    async loadRoles(offset, limit = 25, sort, filters) {
      const arrFilters = toFilterOptions(filters, this.columnIdToFilterName);
      const arrSorters = toSortOptions(sort, this.columnIdToSortName);
      this.items = await this.getRoles({
        pagination: { offset, limit },
        filter: arrFilters,
        sort: arrSorters
      });
    },
    requestPositions({ offset, limit, sort: sorters, filters }) {
      let sortStr = "";
      let filterStr = "";
      if (filters) {
        filterStr = serializeFilters(filters);
      }
      if (sorters) {
        sortStr = serializeSortOptions(sorters);
      }
      this.$router
        .push({
          path: "/admin/roles",
          query: {
            offset: offset,
            limit: limit,
            ...(filterStr.length !== 0 && { filters: filterStr }),
            ...(sortStr.length !== 0 && { sorters: sortStr })
          }
        })
        .catch(() => {});
    },
    reloadRolesByRouteParams(query) {
      if (!query.filters && !query.sorters && !query.offset && !query.limit) {
        this.addDefaultSortAndReload(query);
      } else {
        this.activeFilters = deserializeFilters(query["filters"]);
        this.activeSorters = deserializeSortOptions(query["sorters"]);
        this.loadRoles(
          query.offset,
          query.limit,
          this.activeSorters,
          this.activeFilters
        );
      }
    },
    addDefaultSortAndReload(query) {
      this.requestPositions({
        offset: query.offset ? query.offset : 0,
        limit: query.limit ? query.limit : 25,
        sort: [
          {
            columnId: "createdAt",
            order: "desc"
          }
        ],
        filters: []
      });
    },
    onDragColumns(columns) {
      this.columns = columns;
    },
    onChangeHidden(columnId) {
      const column = _.find(this.columns, { id: columnId });
      this.$set(this.columns, _.findIndex(this.columns, { id: columnId }), {
        ...column,
        hidden: !column.hidden
      });
    }
  },
  created() {
    this.reloadRolesByRouteParams(this.$route.query);
  },
  watch: {
    $route(to, from) {
      this.reloadRolesByRouteParams(to.query);
    },
    roleError(code) {
      if (code) {
        this.$notification.error({
          message: this.$t(`error.${code}`)
        });
      }
    }
  },
  computed: {
    ...mapGetters("moduleAdmin/role", ["roleError", "roleFetching"])
  }
};
</script>

<style>
.more {
  color: #a79db2;
  font-size: 20px;
  cursor: pointer;
}
</style>