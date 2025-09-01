import { USER_ROLES } from 'constants/constants';
import useAuth from './useAuth';

const useGetPosition = () => {
  const { user } = useAuth();

  const position = user?.position[0]?.value;

  const isMasterAdmin = position === USER_ROLES.MASTER_ADMIN.value;
  const isAdmin = position === USER_ROLES.ADMIN.value;
  const isReceptionist = position === USER_ROLES.RECEPTIONIST.value;
  const isCustomer = position === USER_ROLES.CUSTOMER.value;

  return {
    position,
    isMasterAdmin,
    isAdmin,
    isReceptionist,
    isCustomer,
  };
};

export default useGetPosition;
