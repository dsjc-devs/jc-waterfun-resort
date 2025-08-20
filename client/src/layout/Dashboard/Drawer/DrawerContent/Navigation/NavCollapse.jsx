import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Stack
} from "@mui/material";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { handlerActiveItem, useGetMenuMaster } from "api/menu";

const NavCollapse = ({ item, level = 1 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const openItem = menuMaster.openedItem; // current active item id from your global state

  // auto-open parent if one of its children is active
  const hasActiveChild = item.children?.some((child) =>
    matchPath({ path: child.url, end: false }, pathname)
  );
  const [open, setOpen] = useState(hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [pathname]);

  const handleClick = () => setOpen(!open);

  const Icon = item.icon;
  const itemIcon = Icon ? (
    <Icon style={{ fontSize: drawerOpen ? "1rem" : "1.25rem" }} />
  ) : null;

  const textColor = "text.primary";
  const iconSelectedColor = "primary.main";

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && { "&:hover": { bgcolor: "primary.lighter" } }),
          ...(!drawerOpen && { "&:hover": { bgcolor: "transparent" } })
        }}
      >
        {itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: open ? iconSelectedColor : textColor,
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { bgcolor: "secondary.lighter" }
              }),
              ...(!drawerOpen &&
                open && {
                bgcolor: "primary.lighter",
                "&:hover": { bgcolor: "primary.lighter" }
              })
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}

        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography
                variant="h6"
                sx={{ color: open ? iconSelectedColor : textColor }}
              >
                {item.title}
              </Typography>
            }
          />
        )}

        {open ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children?.map((child) => {
            const isSelected =
              !!matchPath({ path: child.url, end: false }, pathname) ||
              openItem === child.id; // also selected if it's the active item in state

            return (
              <ListItemButton
                key={child.id}
                selected={isSelected}
                sx={{
                  pl: drawerOpen ? `${(level + 1) * 28}px` : 4,
                  ...(drawerOpen && {
                    "&.Mui-selected": {
                      bgcolor: "primary.lighter",
                      borderRight: `2px solid ${theme.palette.primary.main}`,
                      color: iconSelectedColor,
                      "&:hover": {
                        color: iconSelectedColor,
                        bgcolor: "primary.lighter"
                      }
                    }
                  }),
                  ...(!drawerOpen && {
                    "&.Mui-selected": { bgcolor: "transparent" }
                  })
                }}
                onClick={() => {
                  handlerActiveItem(child.id); // ✅ update active state
                  if (child.url) navigate(child.url);
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  {child.icon && (
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      {<child.icon />}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{
                          color: isSelected ? iconSelectedColor : textColor
                        }}
                      >
                        {child.title}
                      </Typography>
                    }
                  />
                </Stack>
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number
};

export default NavCollapse;
