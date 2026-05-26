export const money = (value = 0) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(Number(value || 0));

export const date = (value) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
