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
        cartModel.findOne(
          { productId: req.body.productId },
          (error, existingCartItem) => {
            if (error) {
              res.json({ errorMessage: `Failed to add to cart` });
            } else if (existingCartItem) {
              existingCartItem.quantity += 1;
              cartModel.updateOne(
                { _id: existingCartItem._id },
                { quantity: existingCartItem.quantity },
                (updateError) => {
                  if (updateError) {
                    res.json({
                      errorMessage: `Failed to update cart item quantity`,
                    });
                  } else {
                    res.json(existingCartItem);
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
          }
        );
      }
    }
  );
});

router.put(`/cart/:id`, (req, res) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        res.json({ errorMessage: `User is not logged in` });
      }
      cartModel.findOneAndUpdate(
        { userId: req.body.userId, productId: req.body.productId },
        { $inc: { quantity: req.body.quantity } },
        { returnOriginal: false },
        (error, data) => {
          if (error) {
            res.json({
              errorMessage: `An error ocurred while updating quantity`,
            });
          } else if (data.quantity <= 0) {
            // If quantity is zero or less, delete the item
            cartModel.deleteOne(
              { userId: req.body.userId, productId: req.body.productId },
              (deleteError) => {
                if (deleteError) {
                  res.json({
                    errorMessage: `An error ocurred while deleting cart item`,
                  });
                } else {
                  res.json({ message: "Item deleted successfully" });
                }
              }
            );
          } else {
            res.json(data);
          }
        }
      );
    }
  );
});

module.exports = router;
