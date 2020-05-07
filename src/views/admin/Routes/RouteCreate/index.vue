<template>
  <RouteForm :route="route" :onSave="onSave" />
</template>

<script>
import RouteForm from "../RouteForm";
import { routeService } from "@/services/admin";
export default {
  components: { RouteForm },
  data() {
    return {
      route: {
        method: "GET",
        name: "",
        regexUri: "",
        permissionId: undefined,
        status: true
      }
    };
  },
  methods: {
    onSave(data) {
      routeService
        .createRoute(data)
        .then(() => {
          this.$notification.success({
            message: this.$t("shared.CREATE_SUCCESS")
          });
          this.$router.push({ path: `/admin/routes` });
        })
        .catch(console.log);
    }
  },
};
</script>

<style>
</style>