<template>
  <a-card>
    <h2 v-if="mode === 'CREATE'" slot="title">{{ $t('route.ADD_NEW_ROUTE') }}</h2>
    <h2 v-else slot="title">{{ $t('route.UPDATE_ROUTE') }}</h2>
    <a-form-model
      spellcheck="false"
      ref="formRoute"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @submit.prevent="submitForm"
    >
      <a-form-model-item :label="$t('route.METHOD')" prop="method">
        <a-radio-group v-model="form.method">
          <a-radio v-for="item in methods" :key="item.value" :value="item.value">{{item.name}}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item :label="$t('route.ROUTE')" prop="name">
        <a-input v-model="form.name">
          <span slot="addonBefore" class="text-primary">/</span>
        </a-input>
      </a-form-model-item>
      <a-form-model-item :label="$t('route.EXPRESSION')" prop="regexUri">
        <a-select v-model="form.regexUri">
          <a-select-option v-for="item in currentExpressions" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="$t('route.PERMISSION')" prop="permissionId">
        <a-select v-model="form.permissionId">
          <a-select-option
            v-for="item in permissions"
            :key="item.id"
            :value="item.id"
          >{{ item.code }}</a-select-option>
        </a-select>
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
import { mapState } from "vuex";

const listRegex = [
  "[0-9]+",
  "[a-zA-Z]+",
  "[_.-]+",
  "[0-9a-zA-Z]+",
  "[0-9_.-]+",
  "[a-zA-Z_.-]+"
];
export default {
  props: {
    route: {
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
      methods: [
        { value: "GET", name: "GET" },
        { value: "POST", name: "POST" },
        { value: "PUT", name: "PUT" },
        { value: "PATCH", name: "PATCH" },
        { value: "DELETE", name: "DELETE" }
      ],
      form: this.route,
      rules: {
        name: [{ required: true, message: this.$t("validate.FIELD_REQUIRED") }],
        regexUri: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") }
        ],
        permissionId: [
          { required: true, message: this.$t("validate.FIELD_REQUIRED") }
        ]
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      currentExpressions: []
    };
  },
  methods: {
    submitForm() {
      this.$refs.formRoute.validate(valid => {
        if (valid) {
          this.onSave(this.form);
        }
      });
    }
  },
  computed: {
    ...mapState("moduleAdmin/common", ["extraData"]),
    permissions() {
      if (
        this.extraData &&
        this.extraData.permissions &&
        this.extraData.permissions.length
      ) {
        return this.extraData.permissions;
      }
      return [];
    },
    name() {
      return this.form.name;
    }
  },
  watch: {
    name() {
      this.form.regexUri = undefined;
      this.currentExpressions = [];
      if (this.name.includes("{}")) {
        this.currentExpressions = listRegex.map(item => {
          return `/${this.name}`.replace("{}", item);
        });
      } else {
        this.currentExpressions.push(`/${this.name}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
input[type="code"] {
  color: #00f;
}
</style>