<template>
  <a-modal
    :maskClosable="false"
    :closable="!roleFetching"
    :okButtonProps="{
        disabled: roleFetching,
    }"
    :cancelButtonProps="{
        disabled: roleFetching,
    }"
    destroyOnClose
    :title="$t('role.ASSIGN_PERMISSION')"
    v-bind="$attrs"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-checkbox
      :checked="isCheckAll"
      :indeterminate="isIndeterminate"
      @change="e => handleCheckAll(e.target.checked)"
    >
      <template v-if="checkedPermissions === 0">{{all.length}}</template>
      <template v-else>{{checkedPermissions}} / {{all.length}}</template>
      {{$t('permission.PERMISSION')}}
    </a-checkbox>
    <a-divider class="my-2" />
    <div class="scroll-view">
      <a-checkbox
        class="d-block ml-0 mt-2"
        v-for="item in all"
        :key="item.id"
        :checked="item.checked"
        @change="e => handleChange(item.id, e.target.checked)"
      >{{item.name}} - {{item.code}}</a-checkbox>
    </div>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    allPermissions: {
      type: Array
    },
    currentPermissions: {
      type: Array
    },
    roleId: {
      type: Number
    }
  },
  data() {
    return {
      all: this.allPermissions.map(item => ({
        ...item,
        checked: this.currentPermissions.map(ele => ele.id).includes(item.id)
      }))
    };
  },
  computed: {
    ...mapGetters("moduleAdmin/role", ["roleError", "roleFetching"]),
    checkedPermissions() {
      return this.all.filter(item => item.checked).length;
    },
    isCheckAll() {
      return this.all.every(item => item.checked);
    },
    isIndeterminate() {
      return !this.all.every(item => !item.checked) && !this.isCheckAll;
    }
  },
  methods: {
    ...mapActions("moduleAdmin/role", ["assignPermissions"]),
    reset() {
      this.all = this.allPermissions.map(item => ({
        ...item,
        checked: this.currentPermissions.map(ele => ele.id).includes(item.id)
      }));
    },
    async handleOk() {
      const permissionIds = this.all
        .filter(item => item.checked)
        .map(item => item.id);
      const res = await this.assignPermissions({
        roleId: this.roleId,
        permissionIds
      });
      if (res) {
        this.$notification.success({
          message: this.$t("role.ASSIGN_PERMISSION_SUCCESS")
        });
        this.reset();
        this.$emit("ok");
      } else {
        if (roleError) {
          this.$notification.error({
            message: this.$t("error.UNKNOWN_ERROR")
          });
        }
      }
      //   this.$emit("ok");
    },
    handleCancel() {
      this.reset();
      this.$emit("cancel");
    },
    handleChange(id, newVal) {
      this.all = this.all.map(item => {
        if (item.id === id) {
          return {
            ...item,
            checked: newVal
          };
        }
        return item;
      });
    },
    handleCheckAll(newVal) {
      this.all = this.all.map(item => {
        return {
          ...item,
          checked: newVal
        };
      });
    }
  },
  watch: {
    allPermissions() {
      this.reset();
    },
    currentPermissions() {
      this.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-view {
  max-height: 300px;
  overflow-y: scroll;
}
</style>