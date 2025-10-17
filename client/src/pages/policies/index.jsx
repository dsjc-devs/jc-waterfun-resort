import React, { useRef, useEffect, useState } from 'react'
import {
  Box,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  Divider,
  Skeleton,
  Fade
} from '@mui/material'
import { useGetPolicies } from 'api/policies'

const Policies = () => {
  const { data, isLoading } = useGetPolicies()
  const { policies = [] } = data || {}

  const sectionRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (isLoading) return
    const handleScroll = () => {
      const offsets = sectionRefs.current.map(ref => {
        if (!ref) return Number.POSITIVE_INFINITY
        const rect = ref.getBoundingClientRect()
        return Math.abs(rect.top - 120)
      })
      const minOffset = Math.min(...offsets)
      const idx = offsets.indexOf(minOffset)
      setActiveIndex(idx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Auto-scroll to section if hash is present
    const scrollToHash = () => {
      const hash = window.location.hash
      if (hash === '#policy-section-privacy' || hash === '#policy-section-terms') {
        const el = document.getElementById(hash.replace('#', ''))
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
    // On mount
    setTimeout(scrollToHash, 300)
    // On hash change
    window.addEventListener('hashchange', scrollToHash)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [policies, isLoading])

  const handleSidebarClick = idx => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          bgcolor: 'background.paper',
          background: 'linear-gradient(90deg, #f8fafc 0%, #f3f6fb 100%)',
          borderBottom: '1px solid #eee',
          py: 3,
          px: { xs: 2, md: 6 },
          mb: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Typography variant="h3" fontWeight={800} color="primary.main" letterSpacing={0.5}>
          Resort Policies
        </Typography>
        <Divider sx={{ my: 1, borderColor: 'primary.100' }} />
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          Please review our policies before booking or visiting. Your privacy and experience matter to us.
        </Typography>
      </Box>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                position: 'sticky',
                top: 128,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 4,
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                minWidth: 220,
                maxWidth: 260,
                mx: 'auto',
                transition: 'box-shadow 0.2s'
              }}
            >
              <List disablePadding>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      variant="rectangular"
                      height={44}
                      sx={{ borderRadius: 2, mb: 1 }}
                    />
                  ))
                  : policies.map((policy, idx) => (
                    <ListItemButton
                      key={policy._id}
                      selected={activeIndex === idx}
                      onClick={() => handleSidebarClick(idx)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        px: 2,
                        py: 1.5,
                        bgcolor: activeIndex === idx ? 'primary.50' : undefined,
                        color: activeIndex === idx ? 'primary.main' : 'text.primary',
                        fontWeight: activeIndex === idx ? 700 : 500,
                        transition: 'background 0.2s, color 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.100',
                          color: 'primary.main'
                        },
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        ...(activeIndex === idx && {
                          boxShadow: '0 2px 12px rgba(25,118,210,0.08)'
                        })
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: activeIndex === idx ? 'primary.main' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                      />
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            fontWeight={activeIndex === idx ? 700 : 500}
                            sx={{ fontSize: 16 }}
                          >
                            {policy.title}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                <Box key={idx} sx={{ mb: 6 }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 2, md: 4 },
                      borderRadius: 4,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                      bgcolor: 'background.paper',
                      mb: 2
                    }}
                  >
                    <Skeleton variant="text" width={220} height={38} sx={{ mb: 2 }} />
                    <Divider sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={28} />
                  </Paper>
                </Box>
              ))
              : policies.map((policy, idx) => {
                  let sectionId = `policy-section-${policy._id}`;
                  if (policy.title?.toLowerCase().includes('privacy')) {
                    sectionId = 'policy-section-privacy';
                  }
                  if (policy.title?.toLowerCase().includes('terms')) {
                    sectionId = 'policy-section-terms';
                  }
                  return (
                    <Box
                      ref={el => (sectionRefs.current[idx] = el)}
                      sx={{
                        mb: 6,
                        scrollMarginTop: '128px'
                      }}
                      id={sectionId}
                      data-aos="fade-up"
                      data-aos-delay={idx * 100}
                      key={policy._id}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: { xs: 2, md: 4 },
                          borderRadius: 4,
                          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                          bgcolor: 'background.paper',
                          transition: 'box-shadow 0.2s',
                          ...(activeIndex === idx && {
                            boxShadow: '0 8px 32px rgba(25,118,210,0.12)'
                          })
                        }}
                      >
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="h4"
                            fontWeight={800}
                            color={activeIndex === idx ? 'primary.main' : 'text.primary'}
                            sx={{ fontSize: { xs: 22, md: 28 }, letterSpacing: 0.2 }}
                          >
                            {policy.title}
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                          dangerouslySetInnerHTML={{ __html: policy.content }}
                          sx={{
                            fontSize: 17,
                            color: 'text.secondary',
                            lineHeight: 1.85,
                            '& h1, & h2, & h3, & h4': {
                              color: 'primary.main',
                              fontWeight: 800,
                              mt: 2,
                              mb: 1,
                              fontSize: { xs: 20, md: 24 }
                            },
                            ul: {
                              paddingLeft: 24,
                              marginBottom: 16
                            },
                            li: {
                              marginBottom: 8
                            },
                            p: {
                              marginBottom: 16
                            },
                            strong: {
                              color: 'primary.dark'
                            }
                          }}
                        />
                      </Paper>
                    </Box>
                  );
                })}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Policies