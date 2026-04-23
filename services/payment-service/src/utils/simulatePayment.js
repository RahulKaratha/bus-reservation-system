export const simulatePayment = () => {

  const success = Math.random() > 0.2; // 80% success

  return {
    status: success ? "success" : "failed",
    transactionId: "TXN_" + Date.now()
  };

};