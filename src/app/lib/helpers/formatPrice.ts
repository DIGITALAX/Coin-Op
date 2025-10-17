export const formatPrice = (priceWei: string | number): string => {
  const price = typeof priceWei === "string" ? parseFloat(priceWei) : priceWei;
  return (price / 10 ** 18)?.toFixed(4);
};
