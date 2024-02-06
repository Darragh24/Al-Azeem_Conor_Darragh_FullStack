const router = require(`express`).Router();

const productsModel = require(`../models/products`);

const jwt = require("jsonwebtoken");

const fs = require("fs");

const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  "utf8"
);

router.get(`/products`, (req, res) => {
  productsModel.find((error, data) => {
    res.json(data);
  });
});

router.get(`/products/:id`, (req, res) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        res.json({ errorMessage: `User is not logged in` });
      } else {
        productsModel.findById(req.params.id, (error, data) => {
          res.json(data);
        });
      }
    }
  );
});

router.post(`/products`, (req, res) => {
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
        } else if (!/^[a-zA-Z]+$/.test(req.body.colour)) {
          res.json({ errorMessage: `Colour must be a string` });
        } else if (req.body.price < 0 || req.body.price > 1000) {
          res.json({ errorMessage: `Price needs to be between €0 and €1000` });
        } else if (
          req.body.size != "XL" &&
          req.body.size != "L" &&
          req.body.size != "M" &&
          req.body.size != "S" &&
          req.body.size != "XS"
        ) {
          res.json({ errorMessage: `Size Needs to be XL,L,M,S,XS` });
        } else {
          if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
            productsModel.create(req.body, (error, data) => {
              res.json(data);
            });
          }
        }
      }
    }
  );
});

router.put(`/products/:id`, (req, res) => {
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
        } else if (!/^[a-zA-Z]+$/.test(req.body.colour)) {
          res.json({ errorMessage: `Colour must be a string` });
        } else if (req.body.price < 0 || req.body.price > 1000) {
          res.json({ errorMessage: `Price needs to be between €0 and €1000` });
        } else if (
          req.body.size != "XL" &&
          req.body.size != "L" &&
          req.body.size != "M" &&
          req.body.size != "S" &&
          req.body.size != "XS"
        ) {
          res.json({ errorMessage: `Size Needs to be XL,L,M,S,XS` });
        } // input is valid
        else {
          if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
            productsModel.findByIdAndUpdate(
              req.params.id,
              { $set: req.body },
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
});

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
