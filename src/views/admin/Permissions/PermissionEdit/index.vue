<template>
  <div>
    <PermissionForm v-if="permission" :permission="permission" :onSave="onSave" mode="EDIT" />
    <a-spin :style="{ width: '100%' }" v-else />
  </div>
</template>

<script>
import PermissionForm from "../PermissionForm";
import { permissionService } from "@/services/admin";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { PermissionForm },
  async mounted() {
    const id = this.$route.params.id;
    const { permission } = await permissionService.getPermission(id);
    const [resource, action] = permission.code.split(":");
    this.permission = {
      ...permission,
      resource,
      action,
      status: permission.status === "ACTIVE"
    };
  },
  data() {
    return {
      permission: null
    };
  },
  methods: {
    onSave(data) {
      //   permissionService
      //     .updateUser(id, data)
      //     .then(() => {
      //       this.$notification.success({
      //         message: this.$t("shared.UPDATE_SUCCESS")
      //       });
      //       this.$router.push({ path: `/admin/users` });
      //     })
      //     .catch(console.log);
    }
  }
};
</script>

<style>
</style>