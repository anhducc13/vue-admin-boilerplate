import * as requestServices from "@/services/request";
import { parameterHelper } from "@/helpers";

export default {
  getBook: (slug) => {
    return requestServices.clientSite
      .get(`/books/${slug}`)
      .then((res) => res.data);
  },
  getBooks: (params) => {
    return requestServices.clientSite
      .get(`/books`, { params: parameterHelper.getParamsBookList(params) })
      .then((res) => res);
  },
};
