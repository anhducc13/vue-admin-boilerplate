<template>
  <div>
    <RoleForm v-if="role" :role="role" :onSave="onSave" mode="EDIT" />
    <a-spin :style="{ width: '100%' }" v-else />
  </div>
</template>

<script>
import RoleForm from "../RoleForm";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { RoleForm },
  async created() {
    // fetch role
    const id = this.$route.params.id;
    const response = await this.getRole(id);
    if (response) {
      const { role } = response;
      this.role = {
        ...role,
        status: role.status === "ACTIVE"
      };
    } else {
      this.$notification.error({
        message: this.$t(`error.${this.roleError}`)
      });
      this.$router.push({ path: `/admin/roles` });
    }
  },
  data() {
    return {
      role: null
    };
  },
  methods: {
    ...mapActions("moduleAdmin/role", ["updateRole", "getRole"]),
    async onSave(data) {
      await this.updateRole({ roleId: this.role.id, data });
      if (!this.roleError) {
        this.$notification.success({
          message: this.$t("shared.UPDATE_SUCCESS")
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