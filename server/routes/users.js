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

const checkThatUserExistsInUsersCollection = (req, res, next) => {
  usersModel.findOne({ email: req.params.email }, (err, data) => {
    if (err) {
      return next(err);
    }

    req.data = data;
    return next();
  });
};

const checkThatUserIsNotAlreadyInUsersCollection = (req, res, next) => {
  usersModel.findOne({ email: req.params.email }, (err, data) => {
    if (err) {
      return next(err);
    }
    if (data) {
      return next(createError(401));
    }
  });

  return next();
};

const checkThatJWTPasswordIsValid = (req, res, next) => {
  bcrypt.compare(req.params.password, req.data.password, (err, result) => {
    if (err) {
      return next(err);
    }

    if (!result) {
      return next(createError(401));
    }

    return next();
  });
};

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

const checkThatFileIsUploaded = (req, res, next) => {
  if (!req.file) {
    return next(createError(400, `No file was selected to be uploaded`));
  }

  return next();
};

const checkThatFileIsAnImageFile = (req, res, next) => {
  if (
    req.file.mimetype !== "image/png" &&
    req.file.mimetype !== "image/jpg" &&
    req.file.mimetype !== "image/jpeg"
  ) {
    fs.unlink(
      `${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`,
      (err) => {
        return next(err);
      }
    );
  }

  return next();
};

const getAllUsers = (req, res, next) => {
  usersModel.find((error, data) => {
    res.json(data);
  });
};

const getOneUser = (req, res, next) => {
  usersModel.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
};

const emptyUsersCollection = (req, res, next) => {
  usersModel.deleteMany({}, (err, data) => {
    if (err) {
      return next(err);
    }

    if (!data) {
      return next(createError(409, `Failed to empty users collection`));
    }
  });

  return next();
};

const addAdminUserToUsersCollection = (req, res, next) => {
  const adminPassword = `123!"£qweQWE`;
  bcrypt.hash(
    adminPassword,
    parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
    (err, hash) => {
      if (err) {
        return next(err);
      }

      usersModel.create(
        {
          name: "Administrator",
          email: "admin@admin.com",
          password: hash,
          accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN),
        },
        (err, data) => {
          if (err) {
            return next(err);
          }

          if (!data) {
            return next(
              createError(
                409,
                `Failed to create Admin user for testing purposes`
              )
            );
          }

          emptyFolder(process.env.UPLOADED_FILES_FOLDER, false, (result) => {
            return res.json(data);
          });
        }
      );
    }
  );
};

const registerUser = (req, res, next) => {
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
                if (err) {
                  return next(err);
                }
                return res.json({
                  _id: data._id,
                  name: data.name,
                  accessLevel: data.accessLevel,
                  profilePhoto: fileData,
                  token: token,
                });
              }
            );
          }
        }
      );
    }
  );
};

const loginUser = (req, res, next) => {
  const token = jwt.sign(
    { email: req.data.email, accessLevel: req.data.accessLevel },
    JWT_PRIVATE_KEY,
    { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRY }
  );

  if (req.data.profilePhotoFilename) {
    fs.readFile(
      `${process.env.UPLOADED_FILES_FOLDER}/${req.data.profilePhotoFilename}`,
      "base64",
      (err, data) => {
        if (err) {
          return next(err);
        }

        if (data) {
          res.json({
            _id: req.data._id,
            name: req.data.name,
            accessLevel: req.data.accessLevel,
            profilePhoto: data,
            token: token,
          });
        } else {
          return res.json({
            _id: req.data._id,
            name: req.data.name,
            accessLevel: req.data.accessLevel,
            profilePhoto: null,
            token: token,
          });
        }
      }
    );
  } else {
    return res.json({
      _id: req.data._id,
      name: req.data.name,
      accessLevel: req.data.accessLevel,
      profilePhoto: null,
      token: token,
    });
  }
};

const logoutUser = (req, res, next) => {
  res.json({});
};

const deleteUser = (req, res, next) => {
  usersModel.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
};

router.get(`/users`, getAllUsers);
router.get(`/users/:id`, getOneUser);
router.post(
  `/users/reset_user_collection`,
  emptyUsersCollection,
  addAdminUserToUsersCollection
);
router.post(
  `/users/register/:name/:email/:password`,
  upload.single("profilePhoto"),
  checkThatFileIsUploaded,
  checkThatFileIsAnImageFile,
  checkThatUserIsNotAlreadyInUsersCollection,
  registerUser
);
router.post(
  `/users/login/:email/:password`,
  checkThatUserExistsInUsersCollection,
  checkThatJWTPasswordIsValid,
  loginUser
);
router.post(`/users/logout`, logoutUser);
router.delete(
  `/users/:id`,
  verifyUsersJWTPassword,
  checkThatUserIsAnAdministrator,
  deleteUser
);

module.exports = router;
