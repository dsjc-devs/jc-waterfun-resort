const COMPANY_NAME = import.meta.env.VITE_APP_COMPANY_NAME;

const USER_TYPES = [
  {
    label: "Master Admin",
    value: "MASTER_ADMIN"
  },
  {
    label: "Admin",
    value: "ADMIN"
  },
  {
    label: "Receptionist",
    value: "RECEPTIONIST"
  },
  {
    label: "Customer",
    value: "CUSTOMER"
  },
]

const USER_ROLES = USER_TYPES.reduce((acc, role) => {
  acc[role.value] = role;
  return acc;
}, {});

const USER_STATUSSES = ["ACTIVE", "INACTIVE", "ARCHIVED", "BANNED"]


const BLANK_VALUE = "-"

export {
  COMPANY_NAME,
  USER_TYPES,
  BLANK_VALUE,
  USER_ROLES,
  USER_STATUSSES
}