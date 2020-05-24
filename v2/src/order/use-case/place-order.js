module.exports = makePlaceOrder = ({ orderDb }) => {
  return (placeOrder = ({ user, orderedItems }) => {
    if (!user || !user.id) {
      throw new Error("User id must be provided.");
    }
    if (!Array.isArray(orderedItems) || orderedItems.length < 1) {
      throw new Error("Ordered Items must be provided enclosed in array.");
    }
  });
};
