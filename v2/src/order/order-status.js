module.exports = buildMakeOrderStatus = ({}) => {
  return (makeOrderStatus = ({ status = "PENDING" }) => {
    const validOrderStatus = ["PENDING", "CONFIRMED", "CANCELLED", "IN QUEUE"];
    if (!validOrderStatus.includes(status)) {
      throw new Error("Invalid order status provided.");
    }

    return Object.freeze({
      getStatus: () => status,
      markCancel: () => {
        status = "CANCELLED";
      },
      markConfirm: () => {
        status = "CONFIRMED";
      },
      makeInQueue: () => {
        status = "IN QUEUE";
      },
    });
  });
};
