// Check for specific role
const hasRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: `Access denied: ${requiredRole} only` });
    }
  };
};

// Admin only
const isAdmin = hasRole('admin');

// Vendor only
const isVendor = hasRole('vendor');

// Superadmin only
const isSuperAdmin = hasRole('superadmin');

// Admin or Superadmin
const isAdminOrSuperAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: admin or superadmin only' });
  }
};

module.exports = {
  isAdmin,
  isVendor,
  isSuperAdmin,
  isAdminOrSuperAdmin,
  hasRole,
};
