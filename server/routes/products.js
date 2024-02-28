const router = require(`express`).Router();

const productsModel = require(`../models/products`);

const jwt = require("jsonwebtoken");

const fs = require("fs");

const multer = require("multer");
var upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });

const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  "utf8"
);

router.get(`/products/photo/:filename`, (req, res) => {
  fs.readFile(
    `${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`,
    "base64",
    (err, fileData) => {
      if (fileData) {
        res.json({ image: fileData });
      } else {
        res.json({ image: null });
      }
    }
  );
});

router.get(`/products`, (req, res) => {
  productsModel.find((error, data) => {
    res.json(data);
  });
});

router.get(`/products/:id`, (req, res) => {
  productsModel.findById(req.params.id, (error, data) => {
    if (error) {
      res.json(error);
    } else if (!data) {
      res.json({ errorMessage: "Product not found" });
    } else {
      res.json(data);
    }
  });
});

router.post(
  `/products`,
  upload.array(
    "productPhotos",
    parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)
  ),
  (req, res) => {
    jwt.verify(
      req.headers.authorization,
      JWT_PRIVATE_KEY,
      { algorithm: "HS256" },
      (err, decodedToken) => {
        if (err) {
          res.json({ errorMessage: `User is not logged in` });
        } else {
          if (!/^[a-zA-Z]+$/.test(req.body.name)) {
            res.json({ errorMessage: `name must be a string` });
          } else if (req.body.price < 0 || req.body.price > 1000) {
            res.json({
              errorMessage: `Price needs to be between €0 and €1000`,
            });
          } else if (req.body.stock < 0 || req.body.stock > 1000) {
            res.json({
              errorMessage: `Stock needs to be between 0 and 1000`,
            });
          } else {
            if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
              let productDetails = new Object();

              productDetails.name = req.body.name;
              productDetails.price = req.body.price;
              productDetails.stock = req.body.stock;
              productDetails.photos = [];

              req.files.map((file, index) => {
                productDetails.photos[index] = { filename: `${file.filename}` };
              });

              productsModel.create(productDetails, (error, data) => {
                res.json(data);
              });
            } else {
              res.json({
                errorMessage: `User is not an administrator, so they cannot add new records`,
              });
            }
          }
        }
      }
    );
  }
);

router.put(
  `/products/:id`,
  upload.array(
    "productPhotos",
    parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)
  ),
  (req, res) => {
    jwt.verify(
      req.headers.authorization,
      JWT_PRIVATE_KEY,
      { algorithm: "HS256" },
      (err, decodedToken) => {
        if (err) {
          res.json({ errorMessage: `User is not logged in` });
        } else {
          if (!/^[a-zA-Z]+$/.test(req.body.name)) {
            res.json({ errorMessage: `name must be a string` });
          } else if (req.body.price < 0 || req.body.price > 1000) {
            res.json({
              errorMessage: `Price needs to be between €0 and €1000`,
            });
          } else {
            if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
              let productDetails = new Object();

              productDetails.name = req.body.name;
              productDetails.price = req.body.price;
              productDetails.stock = req.body.stock;
              productDetails.photos = [];

              req.files.map((file, index) => {
                productDetails.photos[index] = {
                  filename: `${file.filename}`,
                };
              });
              productsModel.findByIdAndUpdate(
                req.params.id,
                { $set: productDetails },
                (error, data) => {
                  res.json(data);
                }
              );
            } else {
              res.json({
                errorMessage: `User is not an administrator, so they cannot edit records`,
              });
            }
          }
        }
      }
    );
  }
);

router.delete(`/products/:id`, (req, res) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        res.json({ errorMessage: `User is not logged in` });
      } else {
        if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
          productsModel.findByIdAndRemove(req.params.id, (error, data) => {
            res.json(data);
          });
        } else {
          res.json({
            errorMessage: `User is not an administrator, so they cannot delete records`,
          });
        }
      }
    }
  );
});

module.exports = router;
