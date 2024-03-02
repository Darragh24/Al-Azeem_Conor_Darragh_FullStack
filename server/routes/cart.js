const router = require(`express`).Router();

const cartModel = require(`../models/cart`);

const jwt = require("jsonwebtoken");

const fs = require("fs");
const multer = require("multer");
const { get } = require("http");
var upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });

const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  "utf8"
);

const verifyUsersJWTPassword = (req, res, next) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        return next(err);
      }

      req.decodedToken = decodedToken;
      return next();
    }
  );
};

const getAllCartsItems = (req, res, next) => {
  cartModel.find((error, data) => {
    res.json(data);
  });
};

const getUsersCartItems = (req, res, next) => {
  cartModel.find({ userId: req.params.id }, (error, data) => {
    if (error) {
      res.status(500).json({ errorMessage: "Internal Server Error" });
    } else {
      res.json(data);
    }
  });
};

const checkIfCartItemExists = (req, res, next) => {
  cartModel.findOne({ productId: req.body.productId }, (error, data) => {
    if (error) {
      res.status(500).json({ errorMessage: "Internal Server Error" });
    } else {
      req.data = data;
      return next();
    }
  });
};

const createCartItem = (req, res, next) => {
  if (req.data) {
    req.data.quantity += 1;
    cartModel.updateOne(
      { _id: req.data._id },
      { quantity: req.data.quantity },
      (updateError) => {
        if (updateError) {
          res.json({
            errorMessage: `Failed to update cart item quantity`,
          });
        } else {
          res.json(req.data);
        }
      }
    );
  } else {
    let cartDetails = {
      productId: req.body.productId,
      userId: req.body.userId,
      quantity: req.body.quantity,
      productPrice: req.body.productPrice,
    };
    cartModel.create(cartDetails, (createError, createdCartItem) => {
      if (createError) {
        res.json({ errorMessage: `Failed to add to cart` });
      } else {
        res.json(createdCartItem);
      }
    });
  }
};

const increaseCartItemQuantity = (req, res, next) => {
  cartModel.findOneAndUpdate(
    { userId: req.body.userId, productId: req.body.productId },
    { $inc: { quantity: req.body.quantity } },
    { returnOriginal: false },
    (err, data) => {
      if (err) {
        return next(err);
      }
      req.data = data;
      return next();
    }
  );
};

const deleteIfQuantityIsZero = (req, res, next) => {
  if (req.data.quantity <= 0) {
    cartModel.deleteOne(
      { userId: req.body.userId, productId: req.body.productId },
      (deleteError) => {
        if (deleteError) {
          res.json({
            errorMessage: `An error ocurred while deleting cart item`,
          });
        } else {
          cartModel.find(
            { userId: req.body.userId },
            (findError, cartItems) => {
              if (findError) {
                res.json({
                  errorMessage: `An error occurred while fetching cart items`,
                });
              }
              res.json({
                cart: cartItems,
                deleteMessage: "Item deleted successfully",
                productId: req.body.productId,
              });
            }
          );
        }
      }
    );
  } else {
    res.json(req.data);
  }
};

const emptyUserCart = (req, res, next) => {
  cartModel.deleteMany({ userId: req.params.id }, (err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "User cart emptied successfully" });
  });
};

router.get(`/cart`, getAllCartsItems);
router.get(`/cart/:id`, verifyUsersJWTPassword, getUsersCartItems);
router.post(
  `/cart`,
  upload.array(),
  verifyUsersJWTPassword,
  checkIfCartItemExists,
  createCartItem
);
router.put(
  `/cart/:id`,
  verifyUsersJWTPassword,
  increaseCartItemQuantity,
  deleteIfQuantityIsZero
);
router.delete(`/cart/:id`, emptyUserCart);

module.exports = router;
