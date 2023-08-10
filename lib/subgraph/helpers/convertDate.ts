export const convertDate = (timestamp: string) => {
  const date = new Date(Number(timestamp) * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(date);
  return formattedDate;
};
