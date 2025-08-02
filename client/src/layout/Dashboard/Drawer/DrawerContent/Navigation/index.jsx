// material-ui
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const userRole = "MASTER_ADMIN";

  const navGroups = menuItem.items
    .filter((item) => {
      if (item?.access?.includes(userRole)) {
        const filteredChildren = item.children?.filter((child) =>
          child.access?.includes(userRole)
        );

        if (!filteredChildren?.length) {
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


