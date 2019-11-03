module.exports = (req, res, next) => {
  if (req.isAuth) {
    return next();
  } else {
    return res.status(503).json({
      error: "Unauthorized"
    });
  }
};
