<template>
  <RouteForm v-if="route" :route="route" :onSave="onSave" mode="EDIT" />
  <a-spin :style="{ width: '100%' }" v-else />
</template>

<script>
import RouteForm from "../RouteForm";
import { routeService } from "@/services/admin";
export default {
  components: { RouteForm },
  async mounted() {
    const id = this.$route.params.id;
    const { route } = await routeService.getRoute(id);
    this.route = {
      ...route,
      status: route.status === "ACTIVE"
    };
  },
  data() {
    return {
      route: null
    };
  },
  methods: {
    onSave(data) {
      
    }
  },
};
</script>

<style>
</style>