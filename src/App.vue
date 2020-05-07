<template>
  <div id="app">
    <component :is="layout">
      <router-view :key="$route.path" />
    </component>
    <div id="modals"></div>
    <modals-container />
  </div>
</template>

<script>
import enquireScreen from "@/helpers/device";
const defaultLayout = "wrapper";
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || defaultLayout) + "-layout";
    }
  },
  created() {
    enquireScreen(isMobile => {
      this.$store.dispatch("moduleAdmin/common/setDevice", isMobile);
    });
  }
};
</script>
