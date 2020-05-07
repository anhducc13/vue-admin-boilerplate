<template>
  <a-card>
    <h2 v-if="mode === 'CREATE'" slot="title">{{ $t('permission.ADD_NEW_PERMISSION') }}</h2>
    <h2 v-else slot="title">{{ $t('permission.UPDATE_PERMISSION') }}</h2>
    <a-form-model
      ref="formPermission"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @submit.prevent="submitForm"
    >
      <a-form-model-item :label="$t('permission.PERMISSION_NAME')" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item :label="$t('permission.RESOURCE')" prop="resource">
        <a-input v-model="form.resource" />
      </a-form-model-item>
      <a-form-model-item :label="$t('permission.ACTION')" prop="action">
        <a-select v-model="form.action">
          <a-select-option
            v-for="item in actions"
            :key="item.value"
            :value="item.value"
          >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="$t('permission.PERMISSION_CODE')" prop="code">
        <a-input type="code" v-model="form.code" readonly />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{xs: { span: 24 }, sm: { span: 14, offset: 6 }}">
        <ActionButton :htmlType="'submit'">
          <a-icon type="save" />
          {{ $t('shared.SAVE') }}
        </ActionButton>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
export default {
  props: {
    permission: {
      type: Object,
      required: true
    },
    onSave: {
      type: Function,
      required: true
    },
    mode: {
      type: String,
      default: "CREATE"
    }
  },
  data() {
    return {
      actions: [
        { value: "read", name: "Xem" },
        { value: "create", name: "Thêm" },
        { value: "update", name: "Cập nhật" },
        { value: "delete", name: "Xóa" }
      ],
      form: this.permission,
      rules: {
        name: [{ required: true, message: this.$t("validate.FIELD_REQUIRED") }],
        resource: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") }
        ],
        action: [{ required: true, message: this.$t("validate.FIELD_REQUIRED") }]
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.formPermission.validate(valid => {
        if (valid) {
          this.onSave(this.form);
        }
      });
    }
  },
  computed: {
    resource() {
      return this.form.resource;
    },
    action() {
      return this.form.action;
    }
  },
  watch: {
    resource() {
      this.form.code = `${this.form.resource}:${this.form.action}`;
    },
    action() {
      this.form.code = `${this.form.resource}:${this.form.action}`;
    }
  }
};
</script>

<style lang="scss" scoped>
input[type="code"] {
  color: #00f;
}
</style>