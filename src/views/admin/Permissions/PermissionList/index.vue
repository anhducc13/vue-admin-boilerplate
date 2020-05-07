<template>
  <a-card>
    <h2 slot="title">{{$t('permission.PERMISSION_LIST')}}</h2>
    <a-table rowKey="id" bordered :columns="columns" :dataSource="permissions">
      <template slot="title">
        <div class="d-flex justify-content-between">
          <strong>Tổng số: {{ permissions.length }}</strong>
          <a-button type="primary" @click="jumpToCreatePage">
            <a-icon type="plus" />Thêm Permission
          </a-button>
        </div>
      </template>
      <span class="text-primary" slot="code" slot-scope="code">{{ code }}</span>
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
          <a-popconfirm :title="$t('permission.DELETE_THIS_PERMISSION')" okText="Yes" cancelText="No">
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
import { permissionService } from "@/services/admin";

export default {
  async created() {
    const { permissions } = await permissionService.getPermissions();
    this.permissions = permissions;
  },
  data() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id"
      },
      {
        title: this.$t("permission.NAME"),
        dataIndex: "name"
      },
      {
        title: this.$t("permission.CODE"),
        dataIndex: "code",
        scopedSlots: { customRender: "code" }
      },
      {
        title: this.$t("permission.STATUS"),
        dataIndex: "status"
      },
      {
        title: this.$t("permission.UPDATED_AT"),
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
      permissions: []
    };
  },
  methods: {
    jumpToEditPage(id) {
      this.$router.push({ path: `/admin/permissions/${id}/edit` });
    },
    jumpToCreatePage() {
      this.$router.push({ path: `/admin/permissions/create` });
    }
  }
};
</script>

<style>
</style>