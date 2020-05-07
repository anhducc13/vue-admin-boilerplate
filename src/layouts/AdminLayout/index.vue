<template>
  <a-layout class="app-layout">
    <AppSider />
    <a-layout>
      <AppHeader />
      <AppContent />
    </a-layout>
  </a-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AppSider from "@/components/admin/AppSider";
import AppHeader from "@/components/admin/AppHeader";
import AppContent from "@/components/admin/AppContent";

export default {
  name: "AdminLayout",
  components: { AppHeader, AppSider, AppContent },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
$color-sidebar: #1c222b;
$color-sidebar-focus: #272d36;
$sidebar-width: 270px;
$sidebar-collapsed-width: 80px;
$font-size-12: 12px;
$font-size-20: 20px;
$transition-base: all 0.2s ease-in-out;
$color-primary: #eb1f3a;
$color-text-secondary: #8f9598;
$align-base: 16px;
$color-light: #ffffff;
$font-weight-bold: 700;
$line-height-16: 16px;
$line-height-20: 20px;
$line-height-24: 24px;
$color-border: #e0e0e0;
$border-base: 1px solid $color-border;
$border-radius-round: 24px;
.app-spin .ant-spin-dot {
  position: fixed !important;
}

.app-layout {
  min-height: 100vh;

  ::v-deep .app-icon {
    font-size: $font-size-20;
    vertical-align: 0;
  }

  ::v-deep .app-sider {
    background: $color-sidebar;
    z-index: 10;

    .app-trigger {
      position: absolute;
      top: 22px;
      right: -48px;
      cursor: pointer;
      transition: $transition-base;

      &:hover {
        color: $color-primary;
      }
    }

    .app-logo {
      position: fixed;
      width: $sidebar-width;
      height: 122px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: $transition-base;

      img {
        max-width: 180px;
      }
    }

    .app-menu {
      &.ant-menu-dark {
        position: fixed;
        width: $sidebar-width;
        top: 122px;
        background: $color-sidebar;
        user-select: none;
        max-height: calc(100vh - 122px);
        padding-bottom: 52px;
        overflow-y: auto;

        &::-webkit-scrollbar-track {
          background: $color-sidebar;
        }
        &::-webkit-scrollbar-thumb {
          background: $color-text-secondary;
        }

        .app-icon {
          margin-right: $align-base;
          color: $color-text-secondary;
          transition: all 0.3s;
        }

        .ant-menu-item {
          color: $color-text-secondary;
          background: none;
        }

        .ant-menu-item,
        .ant-menu-submenu-title {
          margin: 0;
          height: 48px;
          line-height: 48px;
        }

        .ant-menu-item-active,
        .ant-menu-submenu-active,
        .ant-menu-submenu-open {
          .app-icon {
            color: $color-light;
          }
        }

        .ant-menu-item-selected,
        .ant-menu-submenu-selected {
          .app-icon {
            color: $color-primary;
          }
        }

        .ant-menu-item-selected,
        .ant-menu-submenu-selected .ant-menu-submenu-title {
          font-weight: $font-weight-bold;
        }

        .ant-menu-submenu-open .ant-menu-submenu-title,
        .ant-menu-sub {
          background: $color-sidebar-focus;
          box-shadow: none;
        }

        .ant-menu-sub .ant-menu-item {
          padding-left: 60px !important;
        }
      }
    }

    .app-footer {
      position: fixed;
      padding: $align-base 0;
      bottom: 0;
      width: $sidebar-width;
      line-height: $line-height-20;
      text-align: center;
      color: $color-text-secondary;
      background: $color-sidebar;
    }

    &.collapsed {
      .app-logo {
        width: $sidebar-collapsed-width;
        height: 92px;
        img {
          width: 60px;
        }
      }

      .app-menu.ant-menu-dark {
        width: $sidebar-collapsed-width;
        top: 92px;
      }
    }
  }

  ::v-deep .app-header {
    background: $color-light;
    padding: 0 $align-base;
    text-align: right;
    user-select: none;
    border-bottom: $border-base;

    .app-icon {
      margin: 22px 18px;
      cursor: pointer;
    }

    .app-user {
      position: relative;
      padding: 8px $align-base;
      cursor: pointer;

      .ant-avatar {
        top: -2px;
      }

      .name {
        margin: 0 10px;
      }

      i {
        vertical-align: 0.2em;
      }
    }

    .app-support {
      position: relative;
      top: 2px;
      display: inline-flex;
      align-items: center;
      height: 40px;
      padding: 0 14px;
      border: $border-base;
      border-radius: $border-radius-round;
      cursor: pointer;

      i {
        color: $color-primary;
        font-size: $font-size-20;
        margin-right: 8px;
      }
    }
  }

  ::v-deep .app-content {
    display: flex;
    flex-direction: column;
    margin: 16px;
  }
}
</style>
