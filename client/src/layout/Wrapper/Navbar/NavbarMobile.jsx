import {
  Stack,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  useMediaQuery,
  Collapse
} from '@mui/material'
import { MenuOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { useGetAccommodationTypes } from 'api/accomodationsType'
import { NO_CATEGORY } from 'constants/constants'
import React, { useState } from 'react'

import Logo from 'components/logo/LogoMain'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import textFormatter from 'utils/textFormatter'

const NavbarMobile = ({ handleDrawerToggle, drawerOpen }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  const { accomodationTypes, isLoading } = useGetAccommodationTypes()

  const [openSection, setOpenSection] = useState(null)

  const handleToggleSection = (title) => {
    setOpenSection(openSection === title ? null : title)
  }

  const _navItems = [
    {
      title: "Accommodations",
      link: "/accommodations",
      sublinks: accomodationTypes
        ?.filter((f) => f.title !== NO_CATEGORY)
        .map((f) => ({
          title: f.title,
          link: `/accommodations?type=${textFormatter.toSlug(f.title)}`
        })),
    },
    {
      title: "Amenities",
      link: "/amenities",
      sublinks: [
        { title: "Swimming Pool", link: "/amenities?type=swimming-pool" },
        { title: "Billiards", link: "/amenities?type=billiards" },
        { title: "Karaoke", link: "/amenities?type=karaoke" }
      ]
    },
    {
      title: "Rates",
      link: "/rates",
      sublinks: [
        { title: "Day Tour", link: "/rates?type=day-tour" },
        { title: "Overnight Stay", link: "/rates?type=overnight-stay" },
      ]
    },
    {
      title: "Gallery",
      link: "/gallery",
    },
  ]

  return (
    <React.Fragment>
      {isMobile && (
        <React.Fragment>
          <Stack
            sx={{
              position: 'sticky',
              top: 0,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 999,
              paddingInline: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            <Stack onClick={() => navigate('/')} sx={{ cursor: 'pointer', py: 2 }}>
              <Logo />
            </Stack>
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
              <MenuOutlined />
            </IconButton>
          </Stack>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: 2,
              },
            }}
          >
            <List sx={{ width: 250 }}>
              {_navItems.map((item) => (
                <React.Fragment key={item.title}>
                  <ListItem
                    button
                    onClick={() => item.sublinks ? handleToggleSection(item.title) : navigate(item.link)}
                    sx={{ color: '#fff' }}
                  >
                    <ListItemText primary={item.title} />
                    {item.sublinks ? (
                      openSection === item.title ? <ExpandLess /> : <ExpandMore />
                    ) : null}
                  </ListItem>

                  {item.sublinks && (
                    <Collapse in={openSection === item.title} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.sublinks.map((sub) => (
                          <ListItem
                            key={sub.title}
                            button
                            sx={{ pl: 4, color: '#ddd' }}
                            onClick={() => navigate(sub.link)}
                          >
                            <ListItemText primary={sub.title} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>

            <Stack
              sx={{
                padding: 2,
                borderTop: '1px solid #fff',
                marginTop: 'auto',
                textAlign: 'center',
              }}
            >
              <Button
                variant='contained'
                sx={{ borderRadius: 2 }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </Stack>
          </Drawer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default NavbarMobile
