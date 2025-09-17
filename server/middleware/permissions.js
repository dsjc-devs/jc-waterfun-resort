import { USER_ROLES } from '../constants/constants.js';

export const PERMISSIONS = {
  CREATE_ADMIN: 'create_admin',
  CREATE_RECEPTIONIST: 'create_receptionist', 
  CREATE_CUSTOMER: 'create_customer',
  UPDATE_ADMIN_STATUS: 'update_admin_status',
  UPDATE_RECEPTIONIST_STATUS: 'update_receptionist_status',
  UPDATE_CUSTOMER_STATUS: 'update_customer_status',
  DELETE_ADMIN: 'delete_admin',
  DELETE_RECEPTIONIST: 'delete_receptionist',
  DELETE_CUSTOMER: 'delete_customer',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.MASTER_ADMIN.value]: [
    ...Object.values(PERMISSIONS)
  ],
  
  [USER_ROLES.ADMIN.value]: [
    PERMISSIONS.CREATE_RECEPTIONIST,
    PERMISSIONS.CREATE_CUSTOMER,
    PERMISSIONS.UPDATE_RECEPTIONIST_STATUS,
    PERMISSIONS.UPDATE_CUSTOMER_STATUS,
    PERMISSIONS.DELETE_RECEPTIONIST,
    PERMISSIONS.DELETE_CUSTOMER,
  ],
  
  [USER_ROLES.RECEPTIONIST.value]: [
  ],
  
  [USER_ROLES.CUSTOMER.value]: [
  ]
};

export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions && rolePermissions.includes(permission);
};

export const getUserRole = (user) => {
  if (!user || !user.position || !user.position.length) {
    return null;
  }
  return user.position[0].value;
};

export const canManageUser = (managerRole, targetRole) => {
  const hierarchy = {
    [USER_ROLES.MASTER_ADMIN.value]: 4,
    [USER_ROLES.ADMIN.value]: 3,
    [USER_ROLES.RECEPTIONIST.value]: 2,
    [USER_ROLES.CUSTOMER.value]: 1
  };
  
  return hierarchy[managerRole] > hierarchy[targetRole];
};