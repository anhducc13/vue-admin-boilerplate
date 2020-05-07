<template>
  <a-layout-header class="app-header">
    <a-dropdown :trigger="['click']">
      <span class="app-user" v-if="lang === configConstants.LANG_KEY_VN">
        <a-avatar shape="square" src="/assets/images/vn_flag.svg" />
        {{ $t("shared.VIETNAMESE") }}
      </span>
      <span class="app-user" v-if="lang === configConstants.LANG_KEY_EN">
        <a-avatar shape="square" src="/assets/images/en_flag.svg" />
        {{ $t("shared.ENGLISH") }}
      </span>
      <a-menu slot="overlay">
        <a-menu-item
          :key="configConstants.LANG_KEY_VN"
          @click="() => changeLang(configConstants.LANG_KEY_VN)"
        >
          <a-avatar shape="square" src="/assets/images/vn_flag.svg" />
          {{ $t("shared.VIETNAMESE") }}
        </a-menu-item>
        <a-menu-item
          :key="configConstants.LANG_KEY_EN"
          @click="() => changeLang(configConstants.LANG_KEY_EN)"
        >
          <a-avatar shape="square" src="/assets/images/en_flag.svg" />
          {{ $t("shared.ENGLISH") }}
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-dropdown :trigger="['click']">
      <span class="app-user">
        <a-avatar :src="avatar" />
        <span class="name">{{username}}</span>
        <a-icon type="down" />
      </span>
      <a-menu slot="overlay">
        <a-menu-item>
          <a-icon type="user" />
          <span>{{ $t("header.USER_INFO") }}</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item @click="() => {}">
          <a-icon type="poweroff" />
          <span>{{ $t("header.LOGOUT") }}</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </a-layout-header>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { configConstants } from "@/constants";

export default {
  name: "AppHeader",
  data() {
    return {
      configConstants
    };
  },
  computed: {
    ...mapState("moduleAdmin/common", ["lang"]),
    ...mapGetters("moduleCommon/auth", ["username", "avatar"])
  },
  methods: {
    ...mapActions("moduleAdmin/common", ["setLang"]),
    changeLang(value) {
      this.setLang(value);
      window.location.reload();
    }
  }
};
</script>

<style>
</style>