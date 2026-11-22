export const getTransactionStatusAria = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: 'Transaction is pending approval',
    approved: 'Cashback has been approved and will be paid soon',
    paid: 'Cashback has been paid to your account',
  };
  return statusMap[status] || 'Unknown transaction status';
};

export const getCashbackAmountAria = (amount: number, merchant: string): string => {
  return `Cashback amount ${amount} from ${merchant}`;
};

export const getLoadingStateAria = (isLoading: boolean): string => {
  return isLoading ? 'Content is loading' : 'Content has finished loading';
};

export const getUpdateFrequencyAria = (): string => {
  return 'Data updates every 30 seconds with real-time notifications';
};