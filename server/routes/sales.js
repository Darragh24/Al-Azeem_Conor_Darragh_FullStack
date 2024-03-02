const router = require(`express`).Router();
const salesModel = require(`../models/sales`);
const multer = require("multer");
const upload = multer();
const productsModel = require(`../models/products`);
const createNewSaleDocument = (req, res, next) => {
  let saleDetails = new Object();
  saleDetails.paypalPaymentID = req.params.orderID;
  saleDetails.productInfos = JSON.parse(req.body.productInfos); //Explain JSON.Stringify in BuyProduct Line 56
  saleDetails.userId = req.params.userId;
  saleDetails.price = req.params.price;
  saleDetails.customerName = req.params.customerName;
  saleDetails.customerEmail = req.params.customerEmail;

  for (let i = 0; i < saleDetails.productInfos.length; i++) {
    const productInfo = saleDetails.productInfos[i];
    productsModel.updateOne(
      { _id: productInfo.productId },
      { $inc: { stock: -productInfo.quantity } },
      (error) => {
        if (i === saleDetails.productInfos.length - 1) {
          console.log("All stock levels updated successfully");
        }
      }
    );
  }

  salesModel.create(saleDetails, (err, data) => {
    if (err) {
      return next(err);
    }
  });

  return res.json({ success: true });
};

const getUserSales = (req, res, next) => {
  salesModel.find({ userId: req.params.id }, (error, data) => {
    if (error) {
      res.status(500).json({ errorMessage: "Internal Server Error" });
    } else {
      res.json(data);
    }
  });
};

router.post(
  "/sales/:orderID/:userId/:price/:customerName/:customerEmail",
  upload.none(),
  createNewSaleDocument
);
router.get("/sales/:id", getUserSales);

module.exports = router;
