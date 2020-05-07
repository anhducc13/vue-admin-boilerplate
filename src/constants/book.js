const SALE_STATUS = {
  UPCOMING: "UPCOMING",
  AVAILABLE: "AVAILABLE",
  OUTOFSTOCK: "OUTOFSTOCK",
};

const SALE_STATUS_OPTION_SELECT = Object.keys(SALE_STATUS).map((item) => ({
  key: item,
  label: `book.${item}`,
}));

const SORT_ORDER_PRODUCT = {
  CREATED_AT_DESC: "createdAt-desc",
  CREATED_AT_ASC: "createdAt-asc",
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
  SALE_PRICE_ASC: "salePrice-asc",
  SALE_PRICE_DESC: "salePrice-desc",
};

const SORT_ORDER_OPTION_SELECT = Object.keys(SORT_ORDER_PRODUCT).map(
  (item) => ({
    key: SORT_ORDER_PRODUCT[item],
    label: `book.${item}`,
  })
);

const defaultPriceRange = [10000, 1000000];
const defaultListBookFilters = {
  categorySlug: "",
  offset: 0,
  limit: 10,
  sortOrder: SORT_ORDER_PRODUCT.CREATED_AT_DESC,
  priceRange: defaultPriceRange,
};

export default {
  SALE_STATUS,
  SALE_STATUS_OPTION_SELECT,
  SORT_ORDER_PRODUCT,
  SORT_ORDER_OPTION_SELECT,
  defaultListBookFilters,
};
