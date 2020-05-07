<template>
  <CustomModal :title="'error.SERVER_DOWN_MODAL_TITLE'">
    <div slot="body" class="c-modal-body-2">
      <div v-html="$t('error.SERVER_DOWN_MODAL_DESCRIPTION')"></div>
    </div>
    <div slot="footer" class="c-modal-footer c-button-container is-centered">
      <a-button @click="checkServer()" type="primary">
        {{
        $t("error.TRY_AGAIN")
        }}
      </a-button>
    </div>
  </CustomModal>
</template>

<script>
import *  as requestServices from "@/services/request";
import CustomModal from "../CustomModal";
import { configConstants } from "@/constants";
export default {
  name: "ServerDownModal",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    checkServer() {
      this.$modal.hide(configConstants.SERVER_MAINTENANCE_MODAL);
      requestServices.client.get("/ping").then(res => {
        this.$modal.hide(configConstants.SERVER_MAINTENANCE_MODAL);
        // Navigate to default page
      });
    }
  },
  components: {
    CustomModal
  }
};
</script>

<style>
.modal-body {
  height: 100%;
  padding: 0px !important;
}
</style>
