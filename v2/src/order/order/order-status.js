module.exports = buildMakeOrderStatus = ({}) => {
  return (makeOrderStatus = ({ status = "PENDING" }) => {
    const validOrderStatus = ["PENDING", "CONFIRM", "CANCEL"];
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
    });
  });
};
