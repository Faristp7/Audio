export function adminAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
      res.redirect("/");
    }
  }
  