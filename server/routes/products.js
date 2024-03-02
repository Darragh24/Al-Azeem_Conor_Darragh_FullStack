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

const checkThatUserIsAnAdministrator = (req, res, next) => {
  if (req.decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
    return next();
  } else {
    return next(createError(401));
  }
};

const verifyProduct = (req, res, next) => {
  if (!/^[a-zA-Z]+$/.test(req.body.name)) {
    return next(createError(400, `The product name is invalid`));
  } else if (req.body.price < 0 || req.body.price > 1000) {
    return next(
      createError(
        400,
        `The price of the product needs to be greater than 0 and less than 1000`
      )
    );
  } else {
    return next();
  }
};

const getPhotos = (req, res, next) => {
  fs.readFile(
    `${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`,
    "base64",
    (err, fileData) => {
      if (err) {
        return next(err);
      }
      if (fileData) {
        return res.json({ image: fileData });
      } else {
        return res.json({ image: null });
      }
    }
  );
};

const getAllProducts = (req, res, next) => {
  productsModel.find((error, data) => {
    res.json(data);
  });
};

const getOneProduct = (req, res, next) => {
  productsModel.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
};

const addProduct = (req, res, next) => {
  let productDetails = new Object();

  productDetails.name = req.body.name;
  productDetails.price = req.body.price;
  productDetails.stock = req.body.stock;
  productDetails.photos = [];

  req.files.map((file, index) => {
    productDetails.photos[index] = { filename: `${file.filename}` };
  });

  productsModel.create(productDetails, (err, data) => {
    {
      if (err) {
        return next(err);
      }

      return res.json(data);
    }
  });
};

const editProduct = (req, res, next) => {
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
    (err, data) => {
      if (err) {
        return next(err);
      }

      return res.json(data);
    }
  );
};

const deleteProduct = (req, res, next) => {
  productsModel.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }

    return res.json(data);
  });
};

router.get(`/products/photo/:filename`, getPhotos);
router.get(`/products`, getAllProducts);
router.get(`/products/:id`, getOneProduct);
router.post(
  `/products`,
  upload.array(
    "productPhotos",
    parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)
  ),
  verifyUsersJWTPassword,
  checkThatUserIsAnAdministrator,
  verifyProduct,
  addProduct
);

router.put(
  `/products/:id`,
  upload.array(
    "productPhotos",
    parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)
  ),
  verifyUsersJWTPassword,
  checkThatUserIsAnAdministrator,
  verifyProduct,
  editProduct
);

router.delete(
  `/products/:id`,
  verifyUsersJWTPassword,
  checkThatUserIsAnAdministrator,
  deleteProduct
);

module.exports = router;
