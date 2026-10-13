export const SeparadorDecimal = (num: any) => {
  try {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } catch (error) {
    return "0";
  }
};
