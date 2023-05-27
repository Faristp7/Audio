export function adminAuth(req, res, next) {
  if (req.session.admin) {
      next();
  } else {
    res.redirect("/admin");
  }
}
