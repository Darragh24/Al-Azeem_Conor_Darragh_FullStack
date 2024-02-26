const router = require(`express`).Router();
const salesModel = require(`../models/sales`);
//const productsModel = require(`../models/products`);
const createNewSaleDocument = (req, res, next) => {
  let saleDetails = new Object();
  saleDetails.paypalPaymentID = req.params.orderID;
  saleDetails.productId = req.params.productId;
  saleDetails.userId = req.params.userId;
  saleDetails.price = req.params.price;
  saleDetails.customerName = req.params.customerName;
  saleDetails.customerEmail = req.params.customerEmail;

  /* productsModel.updateOne(
    { id: req.params.productId },
    { $dec: { quantity: req.body.quantity } }
  );*/

  salesModel.create(saleDetails, (err, data) => {
    if (err) {
      return next(err);
    }
  });

  return res.json({ success: true });
};

router.post(
  "/sales/:orderID/:productId/:userId/:price/:customerName/:customerEmail",
  createNewSaleDocument
);

module.exports = router;
