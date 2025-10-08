import {
  Box,
  Dialog,
  Grid,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Divider,
  Paper,
  Link as MuiLink,
  Skeleton
} from '@mui/material'
import { ExpandMore, PolicyOutlined, HelpOutlineOutlined, SecurityOutlined } from '@mui/icons-material'
import AuthLogin from 'pages/authentication/auth-forms/AuthLogin'
import React from 'react'
import MainCard from './MainCard'
import AnimateButton from './@extended/AnimateButton'

import login from 'assets/images/upload/login.png'
import LogoSection from './logo'
import { Link, useNavigate } from 'react-router-dom'
import IconButton from './@extended/IconButton'
import { CloseOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { useGetPolicies } from 'api/policies'
import { useGetFAQS } from 'api/faqs'
import textFormatter from 'utils/textFormatter'

const LoginModal = ({ open, handleClose, message }) => {
  const navigate = useNavigate()
  const { data: policiesData, isLoading: policiesLoading } = useGetPolicies()
  const { data: faqsData, isLoading: faqsLoading } = useGetFAQS({ status: 'POSTED', limit: 5 })

  const policies = policiesData?.policies || []
  const faqs = faqsData?.faqs || []

  const handleNavigateAndClose = (path) => {
    handleClose()
    navigate(path)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xl'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          overflow: { xs: 'auto', sm: 'hidden' },
          maxHeight: { xs: '100vh', sm: '95vh' },
          height: { xs: 'auto', sm: 'fit-content' },
          maxWidth: { xs: '100vw', sm: '1200px' },
          margin: { xs: 0, sm: 2 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }
      }}
      scroll="body"
    >
      <MainCard
        sx={{
          padding: 0,
          position: 'relative',
          background: 'transparent',
          boxShadow: 'none'
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            zIndex: 10,
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease'
          }}
          onClick={handleClose}
        >
          <CloseOutlined />
        </IconButton>

        <Grid container sx={{ minHeight: { xs: 'auto', sm: '70vh' } }}>
          <Grid item xs={12} lg={7} sx={{ order: { xs: 1, lg: 1 } }}>
            <Box sx={{
              p: { xs: 2, sm: 3, md: 4, lg: 5 },
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Stack alignItems='center' sx={{ mb: { xs: 2, sm: 3 } }}>
                <AnimateButton type="scale">
                  <LogoSection />
                </AnimateButton>
              </Stack>
              {message && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: 'primary.50',
                    border: '1px solid',
                    borderColor: 'primary.100',
                    borderRadius: 2
                  }}
                >
                  <Typography
                    variant="body2"
                    color="primary.main"
                    textAlign="center"
                    sx={{ fontWeight: 500 }}
                  >
                    <SecurityOutlined sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                    {message}
                  </Typography>
                </Paper>
              )}

              <Typography
                variant={window.innerWidth < 600 ? 'h4' : 'h3'}
                textAlign='center'
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #0984e3, #07413f)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.75rem', sm: '2.5rem' }
                }}
              >
                Welcome Back
              </Typography>

              <AuthLogin
                handleLogin={() => {
                  handleClose()
                  toast.success("You've successfully logged in.")
                }}
                isNavigateToPortal={false}
              />

              <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                <Typography
                  component={Link}
                  to="/register"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Don&apos;t have an account? Sign up here
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={5} sx={{ order: { xs: 2, lg: 2 } }}>
            <Box
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                maxHeight: { xs: 'none', sm: '90vh' },
                bgcolor: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                borderLeft: { lg: '1px solid rgba(0,0,0,0.08)' },
                borderTop: { xs: '1px solid rgba(0,0,0,0.08)', lg: 'none' },
                display: 'flex',
                flexDirection: 'column',
                overflow: { xs: 'visible', sm: 'auto' }
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: { xs: 1.5, sm: 2 },
                  bgcolor: 'rgba(116, 185, 255, 0.1)',
                  border: '1px solid rgba(116, 185, 255, 0.2)',
                  borderRadius: 2,
                  flexShrink: 0
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: { xs: 1, sm: 1.5 },
                    display: 'flex',
                    alignItems: 'center',
                    color: 'primary.main',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  <SecurityOutlined sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                  Why do I need to login?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                  To ensure a secure and personalized experience, login is required for:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: { xs: 0.25, sm: 0.5 } } }}>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>Making reservations and managing bookings</Typography>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>Accessing exclusive member benefits</Typography>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>Saving your preferences and history</Typography>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'primary.100',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  '&:hover': {
                    borderColor: 'primary.200',
                    transform: { xs: 'none', sm: 'translateY(-2px)' },
                    boxShadow: { xs: 'none', sm: '0 8px 25px rgba(0,0,0,0.1)' }
                  }
                }}
              >
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: 'primary.50', borderBottom: '1px solid', borderColor: 'primary.100' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      fontSize: { xs: '0.85rem', sm: '0.875rem' }
                    }}
                  >
                    <PolicyOutlined sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                    Our Policies
                  </Typography>
                </Box>
                <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                  {policiesLoading ? (
                    <Stack spacing={1}>
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                      ))}
                    </Stack>
                  ) : (
                    <Stack spacing={1}>
                      {policies.length > 0 ? (
                        <>
                          {policies.slice(0, 3).map((policy) => (
                            <AnimateButton key={policy._id} type="scale" scale={{ hover: 1.02, tap: 0.98 }}>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleNavigateAndClose('/policies')}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textAlign: 'left',
                                  width: '100%',
                                  color: 'text.primary',
                                  py: { xs: 0.5, sm: 1 },
                                  px: { xs: 1, sm: 2 },
                                  borderRadius: 1,
                                  minHeight: { xs: 36, sm: 44 },
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <Typography variant="body2" noWrap sx={{ flex: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                  {policy.title}
                                </Typography>
                              </Button>
                            </AnimateButton>
                          ))}
                          <AnimateButton type="scale">
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              onClick={() => handleNavigateAndClose('/policies')}
                              sx={{
                                mt: { xs: 0.5, sm: 1 },
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                py: { xs: 0.5, sm: 0.75 }
                              }}
                            >
                              View All Policies
                            </Button>
                          </AnimateButton>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                          No policies available at the moment.
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  flex: 1,
                  minHeight: 0,
                  border: '1px solid',
                  borderColor: 'warning.100',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: 'warning.200',
                    transform: { xs: 'none', sm: 'translateY(-2px)' },
                    boxShadow: { xs: 'none', sm: '0 8px 25px rgba(0,0,0,0.1)' }
                  }
                }}
              >
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: 'warning.50', borderBottom: '1px solid', borderColor: 'warning.100', flexShrink: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'warning.dark',
                      fontSize: { xs: '0.85rem', sm: '0.875rem' }
                    }}
                  >
                    <HelpOutlineOutlined sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                    Frequently Asked Questions
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                  {faqsLoading ? (
                    <Box sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        {[1, 2, 3].map((i) => (
                          <Box key={i}>
                            <Skeleton variant="text" width="80%" height={20} />
                            <Skeleton variant="text" width="60%" height={16} />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ) : faqs.length > 0 ? (
                    faqs.slice(0, 4).map((faq, index) => (
                      <Accordion
                        key={faq._id}
                        elevation={0}
                        sx={{
                          '&:before': { display: 'none' },
                          '&.Mui-expanded': { margin: 0 },
                          '&:last-child': { borderBottom: 'none' }
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore sx={{ color: 'text.secondary', fontSize: 18 }} />}
                          sx={{
                            px: 2,
                            minHeight: 44,
                            '& .MuiAccordionSummary-content': { my: 0.5 },
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                            {faq.title}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2, pt: 0, pb: 1.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.8rem' }}>
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No FAQs available at the moment.
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                    <AnimateButton type="scale">
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleNavigateAndClose('/faqs')}
                        sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                      >
                        View All FAQs →
                      </Button>
                    </AnimateButton>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </MainCard>
    </Dialog>
  )
}

export default LoginModal