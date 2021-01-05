exports.createPostValidator = (req, res, next) => {
  // title
  req.check("title", "title required").notEmpty();
  req.check("title", "title must be between 4-20 characters").isLength({
    min: 4,
    max: 20,
  });

  // body
  req.check("body", "content required").notEmpty();
  req.check("body", "content must be between 4-2000 characters").isLength({
    min: 4,
    max: 2000,
  });

  // errors
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }

  next();
};

exports.userSignupValidator = (req, res, next) => {
  // name
  req.check("name", "name required").notEmpty();

  // email
  req
    .check("email", "email must be between 3-30 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("email must be of valid format")
    .isLength({
      min: 3,
      max: 30,
    });

  // password
  req.check("password", "password required").notEmpty();
  req
    .check("password")
    .matches(/\d/)
    .withMessage("password must contain a number")
    .isLength({ min: 6 })
    .withMessage("password must conatain at least 6 characters");

  // errors
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }

  next();
};

exports.passwordResetValidator = (req, res, next) => {
  // check for password
  req.check("newPassword", "Password is required").notEmpty();
  req
    .check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long")
    .matches(/\d/)
    .withMessage("must contain a number")
    .withMessage("Password must contain a number");

  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware or ...
  next();
};
