<template>
  <a-card>
    <span v-if="mode === 'CREATE'" slot="title">{{ $t('role.ADD_NEW_ROLE') }}</span>
    <span v-else slot="title">{{ $t('role.UPDATE_ROLE') }}</span>
    <a-form-model
      ref="roleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @submit.prevent="submitForm"
    >
      <a-form-model-item required :label="$t('role.NAME')" prop="name">
        <a-input v-model="form.name" :disabled="roleFetching" :placeholder="$t('role.NAME')" />
      </a-form-model-item>
      <a-form-model-item :label="$t('role.STATUS')" prop="status">
        <a-switch v-model="form.status" />
      </a-form-model-item>
      <a-form-model-item :label="$t('role.DEFAULT_SIGNUP')" prop="defaultSignUp">
        <a-switch v-model="form.defaultSignUp" />
      </a-form-model-item>
      <a-form-model-item :label="$t('role.ROLE_ACP')" prop="roleAcp">
        <a-switch v-model="form.roleAcp" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
        <ActionButton :disabled="roleFetching" :loader="roleFetching" :htmlType="'submit'">
          <a-icon type="save" />
          {{ $t('shared.SAVE') }}
        </ActionButton>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "RoleForm",
  props: {
    role: {
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
      form: this.role,
      rules: {
        name: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") },
          {
            min: 3,
            max: 255,
            message: this.$t("validate.MIN_MAX_LENGTH", { min: 3, max: 255 })
          }
        ]
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
  computed: {
    ...mapGetters("moduleAdmin/role", ["roleError", "roleFetching"])
  },
  methods: {
    submitForm(e) {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.onSave(this.form);
        }
      });
    }
  },
  watch: {
    roleError(code) {
      if (code) {
        this.$notification.error({
          message: this.$t(`error.${code}`)
        });
      }
    }
  }
};
</script>

<style>
</style>