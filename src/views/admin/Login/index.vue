<template>
  <div class="login-container">
    <div class="content">
      <div class="top">
        <div class="header-login">
          <img alt="logo" class="logo" src="/assets/images/vue-antd-logo.png" />
        </div>
        <div class="desc">{{ $t("account.LOGIN_MANAGE_SYSTEM") }}</div>
      </div>
      <div class="login">
        <a-form-model ref="formLogin" :model="form" :rules="rules">
          <a-form-model-item prop="usernameOrEmail">
            <a-input
              size="large"
              v-model="form.usernameOrEmail"
              :placeholder="$t('account.USERNAME_OR_EMAIL')"
            >
              <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input-password
              size="large"
              v-model="form.password"
              :placeholder="$t('account.PASSWORD')"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input-password>
          </a-form-model-item>
          <!-- <a-checkbox>{{ $t("account.REMEMBER_ME") }}</a-checkbox>
          <router-link
            style="float: right"
            to="/dashboard/workplace"
          >{{ $t("account.FORGOT_PASSWORD") }}?</router-link>-->
          <a-form-item>
            <a-button
              size="large"
              style="width: 100%;margin-top: 24px"
              html-type="submit"
              type="primary"
              @click.prevent="handleSubmit"
            >{{ $t("account.LOGIN") }}</a-button>
          </a-form-item>
          <!-- <div class="d-flex justify-content-center">
            {{ $t("account.OTHER_METHOD") }}:
            <a-icon class="icon" type="google" />
            <a-icon class="icon" type="facebook" />
          </div>-->
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      form: {
        usernameOrEmail: "",
        password: ""
      },
      rules: {
        usernameOrEmail: [
          {
            required: true,
            message: this.$t("validate.FIELD_REQUIRED")
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("validate.FIELD_REQUIRED")
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions("moduleCommon/auth", ["login"]),
    handleSubmit(e) {
      this.$refs.formLogin.validate(async valid => {
        if (valid) {
          await this.login(this.form);
          const { redirect } = this.$router.currentRoute.query;
          if (redirect) {
            this.$router.push({ path: redirect });
          } else {
            this.$router.push({ path: "/admin" });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: #f0f2f5 url("/assets/images/login_background.svg") no-repeat
    center 110px;
  background-size: 100%;
  .content {
    padding: 32px 0;
    flex: 1;
    @media (min-width: 768px) {
      padding: 112px 0 24px;
    }
    .top {
      text-align: center;
      .header-login {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 18px;
        color: rgba(0, 0, 0);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login {
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button {
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;
        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
