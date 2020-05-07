<template>
  <a-layout-sider
    collapsible
    :class="['app-sider', collapsed ? 'collapsed': '']"
    :trigger="null"
    :collapsed="collapsed"
    :width="270"
  >
    <a-icon
      class="app-icon app-trigger"
      :type="collapsed ? 'menu-unfold' : 'menu-fold'"
      @click="toggle"
    />
    <div class="app-logo">
      <router-link to="/admin">
        <img src="/assets/images/mainlogo.png" alt="logo" />
      </router-link>
    </div>

    <a-menu
      class="app-menu"
      theme="dark"
      mode="inline"
      :default-open-keys="[openKey]"
      :selected-keys="[selectedKey]"
    >
      <template v-for="item in menu">
        <template v-if="!item.icon" />
        <a-menu-item v-else-if="!item.children" :key="item.path">
          <router-link :to="item.path">
            <a-icon :type="item.icon" class="app-icon" />
            <span>{{ $t(item.name) }}</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else :key="item.name">
          <span slot="title">
            <a-icon class="app-icon" :type="item.icon" />
            <span>{{$t(item.name)}}</span>
          </span>
          <a-menu-item v-for="child in children(item.children)" :key="child.path">
            <router-link :to="child.path">{{ $t(child.name) }}</router-link>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  created() {
    this.handleCollapseMobileOrNot();
  },
  data() {
    return {
      collapsed: false,
      selectedKey: location.pathname,
      openKey: "/"
    };
  },
  computed: {
    children() {
      return items => {
        return this.menu.filter(
          child => items.includes(child.path) && !child.children
        );
      };
    },
    ...mapState("moduleAdmin/common", ["menu", "isMobile"])
  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed;
    },
    getParentKey(selectedKey) {
      return this.menu.find(
        item => item.children && item.children.includes(selectedKey)
      );
    },
    reloadKey() {
      let selectedKey = location.pathname;
      let parentKey = this.getParentKey(selectedKey);
      if (!parentKey) {
        selectedKey = `/${selectedKey.split("/")[1]}`;
        parentKey = this.getParentKey(selectedKey);
      }
      const openKey = parentKey ? parentKey.path : "/";
      this.selectedKey = selectedKey;
      this.openKey = openKey;
    },
    handleCollapseMobileOrNot() {
      if (this.isMobile && !this.collapsed) {
        this.collapsed = true;
        return;
      }
      if (!this.isMobile) {
        this.collapsed = false;
      }
    }
  },
  watch: {
    menu() {
      this.reloadKey();
    },
    $route() {
      this.reloadKey();
    },
    isMobile(val) {
      this.handleCollapseMobileOrNot();
    }
  }
};
</script>

<style>
</style>