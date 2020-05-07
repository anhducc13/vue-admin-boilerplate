import * as _ from "lodash";
const serializeSortOptions = sortOptions => {
  return sortOptions
    .reduce((result, option) => {
      result.push(option.columnId);
      result.push(option.order);
      return result;
    }, [])
    .join(",");
};
const serializeFilters = filters => {
  return filters
    .reduce((result, option) => {
      result.push(option.columnId);
      result.push(option.value);
      result.push(option.displayValue);
      result.push(!!option.disabled);
      return result;
    }, [])
    .join(",");
};
const deserializeFilters = filtersString => {
  const filters = [];
  if (filtersString) {
    _.chunk(filtersString.split(","), 4).forEach(filter => {
      filters.push({
        columnId: filter[0],
        value: deserializeValue(filter[1]),
        displayValue: filter[2],
        disabled: filter[3] === "true"
      });
    });
  }
  return filters;
};
const deserializeSortOptions = sortOptionsString => {
  const sorters = [];
  if (sortOptionsString) {
    _.chunk(sortOptionsString.split(","), 2).forEach(sorter => {
      sorters.push({
        columnId: sorter[0],
        order: sorter[1]
      });
    });
  }
  return sorters;
};
const deserializeValue = value => {
  if (value === "true" || value === "false") {
    return value === "true";
  }
  return value;
};
const toFilterOptions = (filterOptions, columnIdToName = {}) => {
  return filterOptions && filterOptions
    .filter(filterOption => !filterOption.disabled)
    .map(filterOption => {
      const mapping = columnIdToName[filterOption.columnId];
      return {
        name: mapping ? mapping : filterOption.columnId,
        value: filterOption.value
      };
    }) || [];
}
const toSortOptions = (sortOptions, columnIdToName = {}) => {
  return sortOptions && sortOptions.map(sortOption => {
    const mapping = columnIdToName[sortOption.columnId];
    return {
      name: mapping ? mapping : sortOption.columnId,
      order: sortOption.order
    };
  }) || [];
}
export {
  serializeSortOptions,
  serializeFilters,
  deserializeSortOptions,
  deserializeFilters,
  toFilterOptions,
  toSortOptions
};
