<template>
  <RoleForm :role="role" :onSave="onSave" />
</template>

<script>
import RoleForm from "../RoleForm";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { RoleForm },
  data() {
    return {
      role: {
        name: "",
        status: true,
        defaultSignUp: false,
        roleAcp: false
      }
    };
  },
  methods: {
    ...mapActions("moduleAdmin/role", ["createRole"]),
    async onSave(data) {
      await this.createRole(data);
      if (!this.roleError) {
        this.$notification.success({
          message: this.$t("shared.CREATE_SUCCESS")
        });
        this.$router.push({ path: `/admin/roles` });
      }
    }
  },
  computed: {
    ...mapGetters("moduleAdmin/role", ["roleError"])
  }
};
</script>

<style>
</style>