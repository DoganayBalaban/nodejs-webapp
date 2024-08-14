module.exports = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAdmin = req.user ? req.user.isAdmin : false;
  next();
};
