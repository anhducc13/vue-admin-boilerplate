/* eslint-disable no-useless-escape */
const validator = {
  validatePhoneNumber: (rule, value, callback) => {
    const phoneRegex = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g;
    if (value && !phoneRegex.test(value)) {
      callback("Not a valid phone number!");
    } else {
      callback();
    }
  },

  validateWebsite: (rule, value, callback) => {
    const websiteRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    if (value && !websiteRegex.test(value)) {
      callback("Not a valid website!");
    } else {
      callback();
    }
  },

  validateEmail: (rule, value, callback) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm;
    if (value && !emailRegex.test(value)) {
      callback("Not a valid email!");
    } else {
      callback();
    }
  },

  validateEmptyString: (rule, value, callback) =>
    value && value.trim() === ""
      ? callback("Must contain a letter")
      : callback(),

  validateIntergerNumber: (rule, value, callback) => {
    if (value && !Number.isInteger(value)) {
      callback("Not an interger or valid number");
    } else if (value && value < 0) {
      callback("Not accept negative number");
    } else {
      callback();
    }
  }
};

export default validator;
