import jwt from "jsonwebtoken";
import Users from "../models/usersModels.js";
import { PERMISSIONS, hasPermission, getUserRole, canManageUser } from './permissions.js';

const checkIfUserExists = async (req, res, next) => {
  try {
    const user = await Users.findOne({ emailAddress: req.body.emailAddress });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    next();
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Users.findOne({ userId: decoded?.userId }).select("-password")

      req.user = {
        ...user._doc,
        ...decoded,
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = getUserRole(req.user);
    if (!userRole) {
      return res.status(403).json({ message: "User role not found" });
    }

    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({ 
        message: `Access denied. Required permission: ${permission}` 
      });
    }

    next();
  };
};

const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = getUserRole(req.user);
    if (!userRole) {
      return res.status(403).json({ message: "User role not found" });
    }

    const hasAnyPermission = permissions.some(permission => 
      hasPermission(userRole, permission)
    );

    if (!hasAnyPermission) {
      return res.status(403).json({ 
        message: `Access denied. Required permissions: ${permissions.join(' or ')}` 
      });
    }

    next();
  };
};

const canManageTargetUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const managerRole = getUserRole(req.user);
  if (!managerRole) {
    return res.status(403).json({ message: "User role not found" });
  }

  const targetRole = req.body.position?.[0]?.value || req.targetUserRole;
  
  if (targetRole && !canManageUser(managerRole, targetRole)) {
    return res.status(403).json({ 
      message: "You don't have permission to manage this user role" 
    });
  }

  next();
};

const requireMasterAdminForAdminCreation = (req, res, next) => {
  const targetRole = req.body.position?.[0]?.value;
  const userRole = getUserRole(req.user);
  
  if (targetRole === 'ADMIN' && userRole !== 'MASTER_ADMIN') {
    return res.status(403).json({ 
      message: "Only Master Admin can create Admin accounts" 
    });
  }
  
  if (targetRole === 'RECEPTIONIST' && userRole !== 'MASTER_ADMIN' && userRole !== 'ADMIN') {
    return res.status(403).json({ 
      message: "Only Master Admin or Admin can create Receptionist accounts" 
    });
  }
  
  next();
};

const canChangeUserStatus = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const managerRole = getUserRole(req.user);
  
  if (req.targetUserRole === 'ADMIN') {
    if (managerRole !== 'MASTER_ADMIN') {
      return res.status(403).json({ 
        message: "Only Master Admin can change Admin status" 
      });
    }
  }
  
  if (req.targetUserRole === 'RECEPTIONIST') {
    if (managerRole !== 'MASTER_ADMIN' && managerRole !== 'ADMIN') {
      return res.status(403).json({ 
        message: "Only Master Admin or Admin can change Receptionist status" 
      });
    }
  }
  
  next();
};

export {
  protect,
  checkIfUserExists,
  requirePermission,
  requireAnyPermission,
  canManageTargetUser,
  requireMasterAdminForAdminCreation,
  canChangeUserStatus,
  PERMISSIONS
}