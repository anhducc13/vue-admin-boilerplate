<template>
  <PermissionForm :permission="permission" :onSave="onSave" />
</template>

<script>
import PermissionForm from "../PermissionForm";
import { permissionService } from "@/services/admin";
export default {
  components: { PermissionForm },
  data() {
    return {
      permission: {
        name: "",
        resource: "",
        action: "",
        code: "",
        status: true
      }
    };
  },
  methods: {
    onSave(data) {
      permissionService
        .createPermission(data)
        .then(() => {
          this.$notification.success({
            message: this.$t("shared.CREATE_SUCCESS")
          });
          this.$router.push({ path: `/admin/permissions` });
        })
        .catch(console.log);
    }
  },
};
</script>

<style>
</style>