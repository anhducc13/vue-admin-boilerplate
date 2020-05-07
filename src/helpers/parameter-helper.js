import * as moment from "moment";
const parameterHelper = {
  getParams: (pagination, sortOptions, filter) => {
    let params = {};
    if (pagination) {
      if (pagination.offset !== undefined) {
        params.offset = pagination.offset.toString();
      }
      if (pagination.limit !== undefined) {
        params.limit = pagination.limit.toString();
      }
    }
    if (sortOptions && sortOptions.length > 0) {
      const order = [];
      const sort = [];
      sortOptions.forEach((sortOption) => {
        sort.push(sortOption.name);
        order.push(sortOption.order);
      });
      params.sort = sort.join(",");
      params.order = order.join(",");
    }
    if (filter) {
      filter.forEach((filterOption) => {
        let value = filterOption.value;
        if (filterOption.type === "date") {
          value = moment(filterOption.value).format("YYYY-MM-DD");
        }
        let paramValue = params[filterOption.name];
        if (paramValue) {
          paramValue += "," + value;
        } else {
          paramValue = value;
        }
        params[filterOption.name] = paramValue;
      });
    }

    return params;
  },
  getParamsBookList: (params) => {
    const { sortOrder, priceRange, ...rest } = params;
    let newParams = { ...rest };
    if (sortOrder) {
      const [sort, order] = sortOrder.split("-");
      newParams.sort = sort;
      newParams.order = order;
    }
    if (priceRange) {
      newParams.priceRange = priceRange.join(",");
    }
    return newParams;
  },
};
export default parameterHelper;
