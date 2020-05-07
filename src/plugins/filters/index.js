import Vue from "vue";
import { dateFormat } from "./dateFormat";
import { priceFormat } from "./priceFormat";
import { shortText } from "./shortText";

Vue.filter('dateFormat', (date, format, config = {}) => {
  return dateFormat(date, format, { ...config });
});

Vue.filter('priceFormat', (price) => {
  return priceFormat(price);
});

Vue.filter('shortText', (str, maxLength) => {
  return (str === shortText(str, maxLength) ? str : `${shortText(str, maxLength)} ...`)
});

