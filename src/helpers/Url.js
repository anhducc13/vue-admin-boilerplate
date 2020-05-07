const Url = {
  create: (url, pathParameters) => {
    const placeholders = url.match(/({[a-zA-Z]*})/g) || [];
    const pathParamKeys = Object.keys(pathParameters || {});
    placeholders.forEach((placeholder) => {
      const key = placeholder.substr(1, placeholder.length - 2);
      if (pathParamKeys.indexOf(key) === -1) {
        throw new Error(`parameter ${key} was not provided`);
      }
      const value = pathParameters[key];
      url = url.replace(placeholder, encodeURIComponent(value));
    });
    return url;
  }
}

export default Url;
