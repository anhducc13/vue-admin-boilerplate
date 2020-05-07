<template>
  <a-card>
    <h2 v-if="mode === 'CREATE'" slot="title">{{ $t('user.ADD_NEW_USER') }}</h2>
    <h2 v-else slot="title">{{ $t('user.UPDATE_USER') }}</h2>
    <a-form-model
      ref="formUser"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @submit.prevent="submitForm"
    >
      <a-form-model-item :label="$t('user.USERNAME')" prop="userName">
        <a-input
          v-model="form.userName"
          :readOnly="mode === 'EDIT'"
          :disabled="userFetching"
          :placeholder="$t('user.USERNAME')"
        />
      </a-form-model-item>
      <a-form-model-item :label="$t('user.EMAIL')" prop="email">
        <a-input
          v-model="form.email"
          :readOnly="mode === 'EDIT'"
          :disabled="userFetching"
          :placeholder="$t('user.EMAIL')"
        />
      </a-form-model-item>
      <a-form-model-item :label="$t('user.PASSWORD')" prop="password">
        <a-input-password
          v-model="form.password"
          :readOnly="mode === 'EDIT'"
          :disabled="userFetching"
          :visibilityToggle="mode === 'CREATE'"
          :placeholder="$t('user.PASSWORD')"
        />
      </a-form-model-item>
      <a-form-model-item :label="$t('user.ROLE')" prop="roleId">
        <a-select v-model="form.roleId" :disabled="userFetching" :placeholder="$t('user.ROLE')">
          <a-select-option v-for="item in roles" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="$t('user.STATUS')" prop="status">
        <a-switch v-model="form.status" />
      </a-form-model-item>
      <a-form-model-item :label="$t('user.FIRSTNAME')" prop="firstName">
        <a-input
          v-model="form.firstName"
          :disabled="userFetching"
          :placeholder="$t('user.FIRSTNAME')"
        />
      </a-form-model-item>
      <a-form-model-item :label="$t('user.LASTNAME')" prop="lastName">
        <a-input
          v-model="form.lastName"
          :disabled="userFetching"
          :placeholder="$t('user.LASTNAME')"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{xs: { span: 24 }, sm: { span: 14, offset: 6 }}">
        <ActionButton :disabled="userFetching" :loader="userFetching" :htmlType="'submit'">
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
  name: "UserForm",
  props: {
    user: {
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
      form: this.user,
      rules: {
        userName: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") },
          {
            min: 6,
            max: 255,
            message: this.$t("validate.MIN_MAX_LENGTH", { min: 6, max: 255 })
          },
          {
            pattern: /^[a-zA-Z0-9]*$/,
            message: this.$t("validate.CONTAIN_LETTER_OR_NUMBER")
          }
        ],
        email: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") },
          {
            pattern: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
            message: this.$t("validate.EMAIL_INVALID")
          }
        ],
        password:
          this.mode === "CREATE"
            ? [
                { required: true, message: this.$t("validate.FIELD_REQUIRED") },
                {
                  min: 8,
                  max: 255,
                  message: this.$t("validate.MIN_MAX_LENGTH", {
                    min: 8,
                    max: 255
                  })
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/,
                  message: this.$t("validate.VALIDATE_PASSWORD")
                }
              ]
            : [],
        roleId: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") }
        ],
        firstName: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") }
        ],
        lastName: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") }
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
    ...mapState("moduleAdmin/common", ["extraData"]),
    ...mapGetters("moduleAdmin/user", ["userError", "userFetching"]),
    roles() {
      if (
        this.extraData &&
        this.extraData.roles &&
        this.extraData.roles.length
      ) {
        return this.extraData.roles;
      }
      return [];
    }
  },
  methods: {
    submitForm() {
      this.$refs.formUser.validate(valid => {
        if (valid) {
          this.onSave(this.form);
        }
      });
    }
  },
  watch: {
    userError(code) {
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