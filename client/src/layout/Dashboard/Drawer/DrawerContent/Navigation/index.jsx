// material-ui
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import useAuth from 'hooks/useAuth';
import getModules, { icons } from 'menu-items/modules';
import { NO_CATEGORY, USER_ROLES } from 'constants/constants';
import { useGetAccommodationTypes } from 'api/accomodation-type';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const { user } = useAuth()
  const userRole = user?.position[0]?.value

  const { accomodationTypes: _accomodationTypes } = useGetAccommodationTypes()

  const accomodationTypes = _accomodationTypes
    ?.filter(item => item.title !== NO_CATEGORY)
    .concat(_accomodationTypes.filter(item => item.title === NO_CATEGORY));

  const accommodations = accomodationTypes?.map((item, idx) => {
    let icon;

    switch (item?.slug) {
      case 'table':
        icon = icons.TableIcon;
        break;
      case 'event_hall':
        icon = icons.EventHallIcon;
        break;
      case 'room':
        icon = icons.RoomIcon;
        break;
      case 'cottage':
        icon = icons.CottageIcon;
        break;
      case 'guest_house':
        icon = icons.HomeFilled;
        break;
      case 'no_category':
        icon = icons.QuestionCircleOutlined;
        break;
      default:
        icon = icons.CaretRightOutlined;
    }

    return {
      ...item,
      id: idx,
      type: 'item',
      url: `/portal/accommodations?type=${item?.slug}`,
      icon: icon,
      breadcrumbs: false,
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
    };
  });

  const menuItems = getModules({ accommodations });

  const navGroups = menuItems
    .filter((item) => {
      if (!item.access || item.access.includes(userRole)) {
        const filteredChildren = item.children?.filter((child) => {
          if (!child.access) return true;
          return child.access.includes(userRole);
        });

        if (item.children && !filteredChildren?.length) {
          return false;
        }

        item.children = filteredChildren;
        return true;
      }
      return false;
    })
    .map((item) => <NavGroup key={item.id} item={item} />);

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}


