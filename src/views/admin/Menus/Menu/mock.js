export const menu = [
  {
    id: 10,
    name: "Toán học",
    parentId: 0,
    leftId: 11,
  },
  {
    id: 11,
    name: "Hóa học",
    parentId: 0,
    leftId: -1,
  },
  {
    id: 14,
    name: "Toán đại 11",
    parentId: 5,
    leftId: 13,
  },
  {
    id: 8,
    name: "Lý 11",
    parentId: 2,
    leftId: 7,
  },
  {
    id: 7,
    name: "Lý 10",
    parentId: 2,
    leftId: -1,
  },
  {
    id: 15,
    name: "Hóa 12 vô cơ",
    parentId: 12,
    leftId: -1,
  },
  {
    id: 2,
    name: "Lý",
    parentId: 0,
    leftId: 1,
  },
  {
    id: 4,
    name: "Toán 10",
    parentId: 1,
    leftId: -1,
  },
  {
    id: 6,
    name: "Toán 12",
    parentId: 1,
    leftId: 5,
  },
  {
    id: 16,
    name: "Hóa 12 hữu cơ cơ",
    parentId: 12,
    leftId: 15,
  },
  {
    id: 10,
    name: "Hóa 10",
    parentId: 3,
    leftId: -1,
  },
  {
    id: 11,
    name: "Hóa 11",
    parentId: 3,
    leftId: 10,
  },
  {
    id: 9,
    name: "Lý 12",
    parentId: 2,
    leftId: 8,
  },
  {
    id: 13,
    name: "Toán hình 11",
    parentId: 5,
    leftId: -1,
  },
  {
    id: 12,
    name: "Hóa 12",
    parentId: 3,
    leftId: 11,
  },
  {
    id: 5,
    name: "Toán 11",
    parentId: 1,
    leftId: 4,
  },
];

export const reorder = () => {
  return (a, b) => {
    const x = Number(a.get("parentId"));
    const y = Number(b.get("leftId"));
    if (x === y) {
      return -1;
    } else {
      return 1;
    }
  };
};
