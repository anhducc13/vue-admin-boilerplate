<template>
  <div>
    <!-- <Header />
    <Breadcrumbs v-show="!hiddenBreadcrumbs" />
    <div class="body-view">
      <router-view></router-view>
    </div>
    <Footer />
    <a-back-top :visibilityHeight="1">
      <div class="ant-back-top-inner">
        <div id="back-top">
          <i class="fa fa-chevron-up"></i>
        </div>
      </div>
    </a-back-top>-->
  </div>
</template>

<style lang="scss">
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #fff;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #111111;
}
::-webkit-scrollbar-thumb {
  background-color: #111111;
}
#back-top {
  position: fixed;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  right: 8px;
  bottom: 50px;
  top: auto !important;
  cursor: pointer;
  margin: 0;
  font-size: 22px;
  background-color: #f47920;
  color: #fff;
  z-index: 9999;
}
</style>

<script>
import { mapActions } from "vuex";
// import Footer from "@/components/site/Footer";
// import Header from "@/components/site/Header";
// import Breadcrumbs from "@/components/site/Breadcrumbs";
import breadcrumbs from "@/mixins/breadcrumbs";
export default {
  components: {
    // Footer,
    // Header,
    // Breadcrumbs
  },
  mixins: [breadcrumbs],
  created() {
    this.clearBreadcrumbs();
    this.getMenu();
  },
  methods: {
    // ...mapActions("moduleSite/common", ["getMenu"])
  }
};
</script>
