<template>
  <div>
    <UserForm v-if="user" :user="user" :onSave="onSave" mode="EDIT" />
    <a-spin :style="{ width: '100%' }" v-else />
  </div>
</template>

<script>
import UserForm from "../UserForm";
import { userService } from "@/services/admin";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { UserForm },
  async mounted() {
    // fetch user
    const id = this.$route.params.id;
    const res = await this.getUser(id);
    if (!this.userError) {
      const { user } = res;
      this.user = {
        ...user,
        status: user.status === "ACTIVE"
      };
    } else {
      this.$notification.error({
        message: this.$t(`error.${this.userError}`)
      });
      this.$router.push({ path: `/admin/users` });
    }
  },
  data() {
    return {
      user: null
    };
  },
  methods: {
    ...mapActions("moduleAdmin/user", ["updateUser", "getUser"]),
    async onSave(data) {
      await this.updateUser({ userId: this.user.id, data });
      if (!this.userError) {
        this.$notification.success({
          message: this.$t("shared.UPDATE_SUCCESS")
        });
        this.$router.push({ path: `/admin/users` });
      }
    }
  },
  computed: {
    ...mapGetters("moduleAdmin/user", ["userError"])
  }
};
</script>

<style>
</style>