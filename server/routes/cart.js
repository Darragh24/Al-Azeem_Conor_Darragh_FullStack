const router = require(`express`).Router();

const cartModel = require(`../models/cart`);

const jwt = require("jsonwebtoken");

const fs = require("fs");
const multer = require("multer");
var upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });

const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  "utf8"
);

router.get(`/cart`, (req, res) => {
  cartModel.find((error, data) => {
    res.json(data);
  });
});

router.get(`/cart/:id`, (req, res) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        res.json({ errorMessage: `User is not logged in` });
      } else {
        cartModel.find({ userId: req.params.id }, (error, data) => {
          if (error) {
            res.status(500).json({ errorMessage: "Internal Server Error" });
          } else {
            res.json(data);
          }
        });
      }
    }
  );
});

router.post(`/cart`, upload.array(), (req, res) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        res.json({ errorMessage: `Failed to add to cart` });
      } else {
        console.log(req.body);
        let cartDetails = new Object();
        cartDetails.productId = req.body.productId;
        console.log(req.body.productId);
        cartDetails.userId = req.body.userId;
        console.log(req.body.userId);
        cartDetails.quantity = req.body.quantity;
        console.log(req.body.quantity);
        cartDetails.productPrice = req.body.productPrice;
        console.log(req.body.productPrice);
        cartModel.create(cartDetails, (error, data) => {
          res.json(data);
        });
      }
    }
  );
});

module.exports = router;
