
export const getStatusLabel = (status: string, dict: any): string => {
  if (!dict) {
    switch (Number(status)) {
      case 0:
        return "Reserved";
      case 1:
        return "Active";
      case 2:
        return "Disabled";
      default:
        return "Unknown";
    }
  }

  switch (Number(status)) {
    case 0:
      return dict?.Common?.reserved;
    case 1:
      return dict?.Common?.active;
    case 2:
      return dict?.Common?.disabled;
    default:
      return dict?.Common?.unknown;
  }
};
