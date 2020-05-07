<template>
  <UserForm :user="user" :onSave="onSave" />
</template>

<script>
import UserForm from "../UserForm";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { UserForm },
  data() {
    return {
      user: {
        userName: "",
        email: "",
        password: "",
        role: undefined,
        status: true,
        firstName: "",
        lastName: ""
      }
    };
  },
  methods: {
    ...mapActions("moduleAdmin/user", ["createUser"]),
    async onSave(data) {
      await this.createUser(data);
      if (!this.userError) {
        this.$notification.success({
          message: this.$t("shared.CREATE_SUCCESS")
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