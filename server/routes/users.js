const router = require(`express`).Router();

const usersModel = require(`../models/users`);

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const fs = require("fs");
const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  "utf8"
);
const multer = require("multer");
const upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });

const emptyFolder = require("empty-folder");

const getAllUsers = (req, res, next) => {
  usersModel.find((error, data) => {
    res.json(data);
  });
};

const getOneUser = (req, res, next) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        res.json({ errorMessage: `User is not logged in` });
      } else {
        usersModel.findById(req.params.id, (error, data) => {
          res.json(data);
        });
      }
    }
  );
};

const resetUsers = (req, res, next) => {
  usersModel.deleteMany({}, (error, data) => {
    if (data) {
      const adminPassword = `123!"£qweQWE`;

      bcrypt.hash(
        adminPassword,
        parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
        (err, hash) => {
          usersModel.create(
            {
              name: "Administrator",
              email: "admin@admin.com",
              password: hash,
              accessLevel: process.env.ACCESS_LEVEL_ADMIN,
            },
            (createError, createData) => {
              if (createData) {
                emptyFolder(
                  process.env.UPLOADED_FILES_FOLDER,
                  false,
                  (result) => {
                    res.json(createData);
                  }
                );
              } else {
                res.json({
                  errorMessage: `Failed to create Admin user for testing purposes`,
                });
              }
            }
          );
        }
      );
    } else {
      res.json({ errorMessage: `User is not logged in` });
    }
  });
};

const registerUser = (req, res, next) => {
  if (!req.file) {
    res.json({ errorMessage: `No file was selected to be uploaded` });
  } else if (
    req.file.mimetype !== "image/png" &&
    req.file.mimetype !== "image/jpg" &&
    req.file.mimetype !== "image/jpeg"
  ) {
    fs.unlink(
      `${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`,
      (error) => {
        res.json({
          errorMessage: `Only .png, .jpg and .jpeg format accepted`,
        });
      }
    );
  } // uploaded file is valid
  else {
    // If a user with this email does not already exist, then create new user
    usersModel.findOne(
      { email: req.params.email },
      (uniqueError, uniqueData) => {
        if (uniqueData) {
          res.json({ errorMessage: `User already exists` });
        } else {
          bcrypt.hash(
            req.params.password,
            parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
            (error, hash) => {
              usersModel.create(
                {
                  name: req.params.name,
                  email: req.params.email,
                  password: hash,
                  profilePhotoFilename: req.file.filename,
                },
                (err, data) => {
                  if (data) {
                    const token = jwt.sign(
                      { email: data.email, accessLevel: data.accessLevel },
                      JWT_PRIVATE_KEY,
                      {
                        algorithm: "HS256",
                        expiresIn: process.env.JWT_EXPIRY,
                      }
                    );

                    fs.readFile(
                      `${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`,
                      "base64",
                      (err, fileData) => {
                        res.json({
                          _id: data._id,
                          name: data.name,
                          accessLevel: data.accessLevel,
                          profilePhoto: fileData,
                          token: token,
                        });
                      }
                    );
                  } else {
                    res.json({ errorMessage: `User was not registered` });
                  }
                }
              );
            }
          );
        }
      }
    );
  }
};

const loginUser = (req, res, next) => {
  usersModel.findOne({ email: req.params.email }, (error, data) => {
    if (data) {
      bcrypt.compare(req.params.password, data.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { email: data.email, accessLevel: data.accessLevel },
            JWT_PRIVATE_KEY,
            { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRY }
          );

          fs.readFile(
            `${process.env.UPLOADED_FILES_FOLDER}/${data.profilePhotoFilename}`,
            "base64",
            (err, fileData) => {
              if (fileData) {
                res.json({
                  _id: data._id,
                  name: data.name,
                  accessLevel: data.accessLevel,
                  profilePhoto: fileData,
                  token: token,
                });
              } else {
                res.json({
                  _id: data._id,
                  name: data.name,
                  accessLevel: data.accessLevel,
                  profilePhoto: null,
                  token: token,
                });
              }
            }
          );
        } else {
          res.json({ errorMessage: `User is not logged in` });
        }
      });
    } else {
      console.log("not found in db");
      res.json({ errorMessage: `User is not logged in` });
    }
  });
};

const logoutUser = (req, res, next) => {
  res.json({});
};

const deleteUser = (req, res, next) => {
  jwt.verify(
    req.headers.authorization,
    JWT_PRIVATE_KEY,
    { algorithm: "HS256" },
    (err, decodedToken) => {
      if (err) {
        res.json({ errorMessage: `User is not logged in` });
      } else {
        if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
          usersModel.findByIdAndRemove(req.params.id, (error, data) => {
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
};

router.get(`/users`, getAllUsers);
router.get(`/users/:id`, getOneUser);
router.post(`/users/reset_user_collection`, resetUsers);
router.post(
  `/users/register/:name/:email/:password`,
  upload.single("profilePhoto"),
  registerUser
);
router.post(`/users/login/:email/:password`, loginUser);
router.post(`/users/logout`, logoutUser);
router.delete(`/users/:id`, deleteUser);

module.exports = router;
