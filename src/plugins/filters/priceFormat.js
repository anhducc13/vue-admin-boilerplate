export const priceFormat = x => {
  if (!x) return x;
  const [number, decimal] = x.toString().split(".");
  const separateNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimal ? [separateNumber, decimal].join() : separateNumber;
};