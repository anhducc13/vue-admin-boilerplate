<template>
  <a-spin :spinning="loadingGlobal">
    <a-spin :spinning="roleFetching && updatingRole">
      <a-card>
        <span slot="title">{{ $t('role.ROLE_INFORMATION') }}</span>
        <a-form-model ref="roleForm" :model="form" :rules="rules">
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-model-item required :label="$t('role.NAME')" prop="name">
                <a-input
                  :readOnly="state==='VIEW'"
                  v-model="form.name"
                  :placeholder="$t('role.NAME')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item :label="$t('role.STATUS')">
                <a-switch :disabled="state==='VIEW'" v-model="form.status" />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item :label="$t('role.DEFAULT_SIGNUP')">
                <a-switch :disabled="state==='VIEW'" v-model="form.defaultSignUp" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-button class="mr-2" @click="goBack()">
            <a-icon type="left" />
            {{ $t("shared.BACK") }}
          </a-button>
          <a-button type="primary" class="mr-2" v-if="state === 'VIEW'" @click="handleClickEdit()">
            <a-icon type="form" />
            {{ $t("shared.EDIT") }}
          </a-button>
          <a-button-group v-else>
            <a-button @click="handleClickCancel()">
              <a-icon type="close" />
            </a-button>
            <a-button @click="handleClickSave()" type="primary">{{ $t("shared.SAVE") }}</a-button>
          </a-button-group>
        </a-form-model>
      </a-card>
    </a-spin>
    <a-card class="mt-3">
      <span slot="title">{{ $t('role.PERMISSION_LIST') }}</span>

      <a-table rowKey="id" bordered :columns="columns" :dataSource="permissions">
        <template slot="title">
          <div class="d-flex justify-content-between">
            <strong>Tổng số: {{ permissions.length }}</strong>
            <a-button type="primary" @click="visible = true">
              <a-icon type="plus" />
              {{ $t('role.ASSIGN_PERMISSION') }}
            </a-button>
          </div>
        </template>
        <span class="text-primary" slot="code" slot-scope="code">{{ code }}</span>
      </a-table>
      <ModalAssignPermission
        v-if="role"
        :roleId="role.id"
        :allPermissions="allPermissions"
        :currentPermissions="permissions"
        :visible="visible"
        @ok="handleAssign()"
        @cancel="visible = false"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { roleService } from "@/services/admin";
import { mapActions, mapGetters, mapState } from "vuex";
import ModalAssignPermission from "@/components/admin/ModalAssignPermission";

export default {
  components: { ModalAssignPermission },
  created() {
    this.loadingGlobal = true;
    const id = this.$route.params.id;
    Promise.all([this.getRole(id), this.getPermissionsByRoleId(id)])
      .then(([{ role }, { permissions }]) => {
        this.role = {
          ...role,
          status: role.status === "ACTIVE"
        };
        this.form = { ...this.role };
        this.permissions = permissions;
      })
      .catch(() => {
        this.$notification.error({
          message: this.$t("error.UNKNOWN_ERROR")
        });
        this.$router.push({ path: `/admin/roles` });
      })
      .finally(() => {
        this.loadingGlobal = false;
      });
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
      }
    ];
    return {
      loadingGlobal: false,
      updatingRole: false,
      state: "VIEW",

      role: null,
      form: {
        name: "",
        status: false,
        defaultSignUp: false
      },
      rules: {
        name: [{ required: true, message: this.$t("validate.FIELD_REQUIRED") }]
      },

      columns,
      permissions: [],
      visible: false
    };
  },
  computed: {
    ...mapGetters("moduleAdmin/role", ["roleError", "roleFetching"]),
    ...mapState("moduleAdmin/common", ["extraData"]),
    allPermissions() {
      if (
        this.extraData &&
        this.extraData.permissions &&
        this.extraData.permissions.length
      ) {
        return this.extraData.permissions;
      }
      return [];
    }
  },
  methods: {
    ...mapActions("moduleAdmin/role", [
      "updateRole",
      "getRole",
      "getPermissionsByRoleId"
    ]),
    goBack() {
      this.$router.go(-1);
    },
    handleClickEdit() {
      this.state = "EDIT";
    },
    handleClickCancel() {
      this.state = "VIEW";
      this.form = { ...this.role };
      this.$refs.roleForm.resetFields();
    },
    handleClickSave() {
      this.updatingRole = true;
      const id = this.role.id;
      this.updateRole({ roleId: this.role.id, data: this.form })
        .then(async () => {
          this.$notification.success({
            message: this.$t("shared.UPDATE_SUCCESS")
          });
          const res = await this.getRole(id);
          if (res) {
            const { role } = res;
            this.role = {
              ...role,
              status: role.status === "ACTIVE"
            };
            this.form = { ...this.role };
          } else {
            this.$notification.error({
              message: this.$t("role.ROLE_EDIT_NOT_FOUND")
            });
            this.$router.push({ path: `/admin/roles` });
          }
        })
        .finally(() => {
          this.state = "VIEW";
          this.updatingRole = false;
        });
    },
    async handleAssign() {
      this.visible = false;
      const res = await this.getPermissionsByRoleId(this.role.id);
      if (res) {
        const { permissions } = res;
        this.permissions = permissions;
      } else {
        if (this.roleError) {
          this.$notification.error({
            message: this.$t("error.UNKNOWN_ERROR")
          });
        }
      }
    }
  }
};
</script>

<style>
</style>