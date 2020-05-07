<template>
  <a-card>
    <h2 slot="title">{{$t('route.ROUTE_LIST')}}</h2>
    <a-table rowKey="id" bordered :columns="columns" :dataSource="routes">
      <template slot="title">
        <div class="d-flex justify-content-between">
          <strong>Tổng số: {{ routes.length }}</strong>
          <a-button type="primary" @click="jumpToCreatePage">
            <a-icon type="plus" />Thêm Route
          </a-button>
        </div>
      </template>
      <span slot="name" slot-scope="name" class="text-primary">
          {{ `/${name}` }}
      </span>
      <span slot="permission" slot-scope="item" class="text-primary">
          {{ item.permission.code }}
      </span>
      <span slot="updatedAt" slot-scope="updatedAt">{{ updatedAt | dateFormat('DD-MM-YYYY') }}</span>
      <template slot="actions" slot-scope="item">
        <div class="button-line-large white-space-nowrap mr-2">
          <a-button
            title="Edit"
            class="ant-btn-icon-only"
            type="primary"
            @click="jumpToEditPage(item.id)"
          >
            <a-icon type="edit" />
          </a-button>
        </div>
        <div class="button-line-large white-space-nowrap">
          <a-popconfirm :title="$t('route.DELETE_THIS_ROUTE')" okText="Yes" cancelText="No">
            <a-button title="Delete" class="ant-btn-icon-only" type="danger">
              <a-icon type="close" />
            </a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { routeService } from "@/services/admin";

export default {
  async created() {
    const { routes } = await routeService.getRoutes();
    this.routes = routes;
  },
  data() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id"
      },
      {
        title: this.$t("route.METHOD"),
        dataIndex: "method"
      },
      {
        title: this.$t("route.ROUTE"),
        dataIndex: "name",
        scopedSlots: { customRender: "name" }
      },
      {
        title: this.$t("route.PERMISSION"),
        scopedSlots: { customRender: "permission" }
      },
      {
        title: this.$t("route.UPDATED_AT"),
        dataIndex: "updatedAt",
        scopedSlots: { customRender: "updatedAt" }
      },
      {
        width: 150,
        scopedSlots: { customRender: "actions" }
      }
    ];
    return {
      columns: columns,
      routes: []
    };
  },
  methods: {
    jumpToEditPage(id) {
      this.$router.push({ path: `/admin/routes/${id}/edit` });
    },
    jumpToCreatePage() {
      this.$router.push({ path: `/admin/routes/create` });
    }
  }
};
</script>

<style>
</style>