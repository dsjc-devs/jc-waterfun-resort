import { getUserRole, hasPermission, ROLE_PERMISSIONS, PERMISSIONS } from '../middleware/permissions.js';

export const checkPermissions = (user, requiredPermissions) => {
  const userRole = getUserRole(user);
  if (!userRole) return false;
  
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
};

export const getUserPermissions = (user) => {
  const userRole = getUserRole(user);
  if (!userRole) return [];
  
  return ROLE_PERMISSIONS[userRole] || [];
};

export const canAccessUserResource = (user, action = 'read') => {
  const userRole = getUserRole(user);
  if (!userRole) return false;
  
  if (action === 'read') return true;
  
  const permissionMap = {
    'create': [PERMISSIONS.CREATE_ADMIN, PERMISSIONS.CREATE_RECEPTIONIST, PERMISSIONS.CREATE_CUSTOMER],
    'update': [PERMISSIONS.UPDATE_ADMIN_STATUS, PERMISSIONS.UPDATE_RECEPTIONIST_STATUS, PERMISSIONS.UPDATE_CUSTOMER_STATUS],
    'delete': [PERMISSIONS.DELETE_ADMIN, PERMISSIONS.DELETE_RECEPTIONIST, PERMISSIONS.DELETE_CUSTOMER]
  };
  
  const requiredPermissions = permissionMap[action] || [];
  return requiredPermissions.length === 0 || checkPermissions(user, requiredPermissions);
};

export { PERMISSIONS };