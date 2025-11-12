export function isAdmin(req, res, next) {
    
  const userRole = req.userRole;

  if (userRole === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Accès refusé" });
  }
}
