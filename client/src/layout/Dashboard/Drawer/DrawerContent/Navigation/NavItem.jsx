import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

// project import
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';

export default function NavItem({ item, level }) {
  const theme = useTheme();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const openItem = menuMaster.openedItem;

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }
  let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const Icon = item.icon;
  let itemIcon = false;
  if (item.icon) {
    if (typeof item.icon === 'string') {
      itemIcon = (
        <Typography fontSize={18} fontWeight={300}>
          {item.icon}
        </Typography>
      );
    } else {
      itemIcon = <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />;
    }
  }

  const location = useLocation();
  const { pathname, search } = location;

  const params = new URLSearchParams(search);
  const typeParam = params.get('type');

  // Parse the item's query type from its url
  const itemUrl = new URL(item.url, window.location.origin);
  const itemType = itemUrl.searchParams.get('type');

  const isSelected =
    !!matchPath({ path: itemUrl.pathname, end: false }, pathname) &&
    itemType === typeParam;

  // active menu item on page load
  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id);
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  const buttonContent = (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => handlerActiveItem(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 28}px` : 1.5,
        pr: drawerOpen ? 1.5 : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        justifyContent: drawerOpen ? 'flex-start' : 'center',
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: 'primary.lighter'
          },
          '&.Mui-selected': {
            bgcolor: 'primary.lighter',
            borderRight: `2px solid ${theme.palette.primary.main}`,
            color: iconSelectedColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: 'primary.lighter'
            }
          }
        }),
        ...(!drawerOpen && {
          '&:hover': {
            bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent'
          }
        })
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              margin: '0 auto',
              '&:hover': {
                bgcolor: 'secondary.lighter'
              }
            }),
            ...(!drawerOpen &&
              isSelected && {
              bgcolor: 'primary.lighter',
              '&:hover': {
                bgcolor: 'primary.lighter'
              }
            })
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );

  return !drawerOpen && level === 1 ? (
    <Tooltip
      title={item.title}
      placement="right"
      arrow
      enterDelay={500}
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: theme.palette.grey[800],
          color: theme.palette.common.white,
          fontSize: '0.75rem',
          fontWeight: 500
        },
        '& .MuiTooltip-arrow': {
          color: theme.palette.grey[800]
        }
      }}
    >
      {buttonContent}
    </Tooltip>
  ) : buttonContent;
}

NavItem.propTypes = { item: PropTypes.object, level: PropTypes.number };
