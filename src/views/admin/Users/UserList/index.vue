<template>
  <a-card>
    <h2>{{$t('user.USER_LIST')}}</h2>
    <ItemTable
      checkable
      attributeNameChecked="checked"
      :showFilterButton="true"
      :statusQuickFilters="statusQuickFilters"
      :showRecord="true"
      :columns="columns"
      :items="items"
      :loadingTableData="userFetching"
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
            <a-menu-item @click="handleDeleteMulti()">{{ $t('user.DELETE_USER_SELECTED') }}</a-menu-item>
          </a-menu>
          <div>
            <SvgIcon :src="'/assets/icons/more-action.svg'" />
          </div>
        </a-dropdown>
      </template>
      <template slot="buttons">
        <a-button type="primary" @click="jumpToCreatePage">{{$t('user.ADD_NEW_USER')}}</a-button>
      </template>

      <template slot="id" slot-scope="{ item }">
        <span>{{ item.id }}</span>
      </template>

      <template slot="userName" slot-scope="{ item }">
        <span>{{ item.userName }}</span>
      </template>

      <template slot="firstName" slot-scope="{ item }">
        <span>{{ item.firstName }}</span>
      </template>

      <template slot="lastName" slot-scope="{ item }">
        <span>{{ item.lastName }}</span>
      </template>

      <template slot="status" slot-scope="{ item }">
        <a-tag :color="item.status === 'ACTIVE' ? 'green' : 'red'">{{ item.status }}</a-tag>
      </template>

      <template slot="email" slot-scope="{ item }">
        <span>{{ item.email }}</span>
      </template>

      <template slot="role" slot-scope="{ item }">
        <a-tag color="magenta">{{ item.role.name }}</a-tag>
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
import axios from "axios";
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
  name: "UserList",
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
          id: "id",
          sortable: true,
          header: "Id"
        },
        {
          id: "userName",
          sortable: true,
          header: this.$t("user.USERNAME"),
          filter: {
            type: "search"
          }
        },
        {
          id: "firstName",
          hidden: true,
          sortable: true,
          header: this.$t("user.FIRSTNAME"),
          filter: {
            type: "search"
          }
        },
        {
          id: "lastName",
          hidden: true,
          sortable: true,
          header: this.$t("user.LASTNAME"),
          filter: {
            type: "search"
          }
        },
        {
          id: "email",
          sortable: true,
          header: this.$t("user.EMAIL"),
          filter: {
            type: "search"
          }
        },
        {
          id: "role",
          header: this.$t("user.ROLE")
        },
        {
          id: "status",
          sortable: true,
          header: this.$t("role.STATUS")
        },
        {
          id: "createdAt",
          hidden: true,
          sortable: true,
          header: this.$t("user.CREATED_AT")
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
    ...mapActions("moduleAdmin/user", [
      "getUsers",
      "deleteUser",
      "deleteUsers"
    ]),
    jumpToEditPage(id) {
      const path = Url.create("/admin/users/{id}/edit", { id });
      this.$router.push({ path });
    },
    jumpToCreatePage() {
      this.$router.push({ path: `/admin/users/create` });
    },
    handleDelete(id) {
      this.$confirm({
        title: this.$t("shared.CONFIRM"),
        content: this.$t("shared.DO_YOU_WANT_DELETE_THIS_RECORD"),
        onOk: async () => {
          await this.deleteUser(id);
          this.reloadUsersByRouteParams(this.$route.query);
          if (!this.userError) {
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
        content: this.$t("user.DELETE_USER_SELECTED"),
        onOk: async () => {
          const userIds = this.items.data
            .filter(ele => ele["checked"])
            .map(ele => ele.id);
          if (!userIds.length) {
            this.$message.warning(
              this.$t("user.PLEASE_SELECT_AT_LEAST_ONE_USER")
            );
          }
          await this.deleteUsers(userIds);
          this.reloadUsersByRouteParams(this.$route.query);
          if (!this.userError) {
            this.$notification.success({
              message: this.$t("shared.DELETE_SUCCESS")
            });
          }
        }
      });
    },
    generateCsv(event) {
      // console.log(event);
      // debugger;
    },
    async loadUsers(offset, limit = 25, sort, filters) {
      const arrFilters = toFilterOptions(filters, this.columnIdToFilterName);
      const arrSorters = toSortOptions(sort, this.columnIdToSortName);
      this.items = await this.getUsers({
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
          path: "/admin/users",
          query: {
            offset: offset,
            limit: limit,
            ...(filterStr.length !== 0 && { filters: filterStr }),
            ...(sortStr.length !== 0 && { sorters: sortStr })
          }
        })
        .catch(() => {});
    },
    reloadUsersByRouteParams(query) {
      if (!query.filters && !query.sorters && !query.offset && !query.limit) {
        this.addDefaultSortAndReload(query);
      } else {
        this.activeFilters = deserializeFilters(query["filters"]);
        this.activeSorters = deserializeSortOptions(query["sorters"]);
        this.loadUsers(
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
    this.reloadUsersByRouteParams(this.$route.query);
  },
  watch: {
    $route(to, from) {
      this.reloadUsersByRouteParams(to.query);
    },
    userError(code) {
      if (code) {
        this.$notification.error({
          message: this.$t(`error.${code}`)
        });
      }
    }
  },
  computed: {
    ...mapGetters("moduleAdmin/user", ["userError", "userFetching"])
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