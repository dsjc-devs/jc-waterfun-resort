const COMPANY_NAME = import.meta.env.VITE_APP_COMPANY_NAME;

const USER_TYPES = [
  {
    label: "Master Admin",
    value: "MASTER_ADMIN"
  },
  {
    label: "Staff",
    value: "STAFF"
  },
  {
    label: "Customer",
    value: "CUSTOMER"
  }
]

export {
  COMPANY_NAME,
  USER_TYPES
}