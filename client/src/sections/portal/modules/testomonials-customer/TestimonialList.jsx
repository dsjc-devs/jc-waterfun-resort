import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Rating,
  Stack,
  Avatar,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  InputLabel,
  Fab,
  Pagination,
  Chip,
} from '@mui/material';
import { Add as AddIcon, FormatQuote } from '@mui/icons-material';
import { useGetTestimonials } from 'api/testimonials';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import * as Yup from 'yup';
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import testimonialsApi from 'api/testimonials';

const validationSchema = Yup.object().shape({
  remarks: Yup.string().required('Message is required').min(20, 'Min 20 characters').max(500, 'Max 500 characters'),
  rating: Yup.number().required('Rating required').min(1).max(5)
});

const TestimonialsDetails = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const userId = useMemo(() => user?.userId || user?._id || user?.id, [user]);

  const { data: userTestimonialsData, isLoading: isLoadingUser, mutate: mutateUser } = useGetTestimonials({
    userId,
    page,
    limit
  });

  const testimonials = useMemo(() => {
    const userTestimonials = userTestimonialsData?.testimonials || [];

    return userTestimonials
      .filter(t => {
        const testimonialUserId = t.userId || t.user?._id || t.user?.userId;
        return testimonialUserId === userId;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [userTestimonialsData, userId]);

  const isLoading = isLoadingUser;
  const totalPages = userTestimonialsData?.totalPages || 1;

  const mutate = () => {
    mutateUser();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderCard = (t) => {
    const fullName = `${t.firstName} ${t.lastName}`;
    const initials = `${t.firstName?.[0] || ''}${t.lastName?.[0] || ''}`;
    const isTruncated = t.remarks && t.remarks.length > 200;
    const userId = user?.userId || user?._id || user?.id;
    const testimonialUserId = t.userId || t.user?._id || t.user?.userId;
    const isOwnTestimonial = testimonialUserId === userId;
    const isPending = !t.isPosted;

    return (
      <Paper
        key={t.testimonialId || t._id}
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 2,
          bgcolor: '#fff',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all .25s',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            borderColor: 'primary.main'
          }
        }}
        onClick={() => setSelectedTestimonial(t)}
      >
        <Stack direction="row" spacing={2}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: '#0B4F71', fontWeight: 600 }}>{initials}</Avatar>
          <Box flex={1} pt={0.5}>
            {isOwnTestimonial && (
              <Chip
                label={isPending ? "Pending Approval" : "Approved"}
                size="small"
                color={isPending ? "warning" : "success"}
                sx={{ mb: 1, fontWeight: 600 }}
              />
            )}
            <Typography variant="body1" color="text.primary" sx={{ mb: 1, lineHeight: 1.5 }}>
              {isTruncated
                ? `${t.remarks.slice(0, 200)}...`
                : t.remarks}
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ fontSize: 12 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 0.5 }} color="text.secondary">
                {fullName.toUpperCase()}
              </Typography>
              <Rating
                value={t.rating}
                readOnly
                size="small"
                sx={{ '& .MuiRating-iconFilled': { color: '#f6b600' } }}
              />
              <Typography variant="caption" color="text.secondary">{formatDate(t.createdAt)}</Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    );
  };

  const hasPendingTestimonials = useMemo(() => {
    return testimonials.some(t => !t.isPosted);
  }, [testimonials]);

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ mt: 3, mb: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box sx={{ mr: 2, width: 'fit-content' }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#f0f7ff',
                border: '1px solid',
                borderColor: 'primary.light',
                display: 'inline-block'
              }}
            >
              <Typography variant="body2" color="primary.dark">
                Note: Pending testimonials are subject to staff approval before they become visible.
              </Typography>
            </Paper>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Add Testimonial
          </Button>
        </Stack>

        {hasPendingTestimonials && (
          <Box sx={{ p: 2, mb: 3, bgcolor: '#FFF9E6', borderLeft: '4px solid #FFA726' }}>
            <Typography variant="body2" sx={{ color: '#8B6914' }}>
              You have testimonial(s) pending approval. They will be visible once approved by staff.
            </Typography>
          </Box>
        )}

        {isLoading ? (
          <Stack>{[1, 2, 3].map(i => (
            <Paper key={i} elevation={0} sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: '#fff' }}>
              <Stack direction="row" spacing={2}>
                <Skeleton variant="circular" width={56} height={56} />
                <Box flex={1}>
                  <Skeleton variant="text" width="90%" height={32} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              </Stack>
            </Paper>))}
          </Stack>
        ) : testimonials.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: '#fff', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>No testimonials yet</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Be the first to share your experience.</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Testimonial</Button>
          </Paper>
        ) : (
          <>
            <Box>{testimonials.map(renderCard)}</Box>
            <Stack direction="row" justifyContent="center" mt={2}>
              <Pagination color="primary" page={page} count={totalPages} onChange={(_, v) => setPage(v)} />
            </Stack>
          </>
        )}

        <Fab color="primary" onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 32, right: 32, display: { xs: 'flex', sm: 'none' } }}><AddIcon /></Fab>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
          <DialogTitle>
            <Typography variant="h5" fontWeight={700}>Share Your Experience</Typography>
            <Typography variant="body2" color="text.secondary">Your review helps future guests.</Typography>
          </DialogTitle>
          <Formik
            initialValues={{
              userId: user?.userId || user?._id || user?.id || '',
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              emailAddress: user?.emailAddress || '',
              remarks: '',
              rating: 0
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                await testimonialsApi.TESTIMONIALS.addTestimonial(values);
                toast.success('Submitted! Pending approval.');
                resetForm();
                setOpen(false);
                mutate();
              } catch (e) {
                toast.error(e?.message || 'Submission failed');
              } finally { setSubmitting(false); }
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting, touched, errors, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <InputLabel sx={{ mb: 0.5 }}>First Name</InputLabel>
                      <TextField fullWidth name="firstName" value={values.firstName} disabled />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel sx={{ mb: 0.5 }}>Last Name</InputLabel>
                      <TextField fullWidth name="lastName" value={values.lastName} disabled />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 0.5 }}>Email</InputLabel>
                      <TextField fullWidth name="emailAddress" value={values.emailAddress} disabled />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 0.5 }}>Rating *</InputLabel>
                      <Rating
                        name="rating"
                        value={values.rating}
                        onChange={(_, v) => setFieldValue('rating', v)}
                        sx={{ '& .MuiRating-iconFilled': { color: '#f6b600' } }}
                      />
                      {touched.rating && errors.rating && (
                        <Typography variant="caption" color="error">{errors.rating}</Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ mb: 0.5 }}>Message *</InputLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="remarks"
                        value={values.remarks}
                        onChange={handleChange}
                        placeholder="Share details of your stay (20-500 characters)"
                        error={touched.remarks && Boolean(errors.remarks)}
                        helperText={touched.remarks && errors.remarks ? errors.remarks : `${values.remarks.length}/500`}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.lighter', borderLeft: '4px solid', borderColor: 'info.main' }}>
                        <Typography variant="caption" color="info.main">Reviews appear after staff approval.</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
                  <AnimateButton>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>Submit</LoadingButton>
                  </AnimateButton>
                </DialogActions>
              </form>
            )}
          </Formik>
        </Dialog>

        <Dialog
          open={Boolean(selectedTestimonial)}
          onClose={() => setSelectedTestimonial(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
            }
          }}
        >
          {selectedTestimonial && (() => {
            const testimonialUserId = selectedTestimonial.userId || selectedTestimonial.user?._id || selectedTestimonial.user?.userId;
            const isOwnTestimonial = testimonialUserId === userId;
            const isPending = !selectedTestimonial.isPosted;

            return (
              <>
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#0B4F71',
                        fontSize: 28,
                        fontWeight: 600
                      }}
                    >
                      {`${selectedTestimonial.firstName?.[0] || ''}${selectedTestimonial.lastName?.[0] || ''}`}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {`${selectedTestimonial.firstName} ${selectedTestimonial.lastName}`}
                      </Typography>
                      {selectedTestimonial.emailAddress && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedTestimonial.emailAddress}
                        </Typography>
                      )}
                      <Stack direction="row" justifyContent="center" mt={1} spacing={1}>
                        <Rating
                          value={selectedTestimonial.rating}
                          readOnly
                          size="small"
                          sx={{ '& .MuiRating-iconFilled': { color: '#f6b600' } }}
                        />
                      </Stack>
                      {isOwnTestimonial && (
                        <Box mt={1}>
                          <Chip
                            label={isPending ? "Pending Approval" : "Approved"}
                            size="small"
                            color={isPending ? "warning" : "success"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{ py: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <FormatQuote
                      sx={{
                        fontSize: 40,
                        color: 'primary.main',
                        opacity: 0.2,
                        position: 'absolute',
                        top: -10,
                        left: -10
                      }}
                    />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        px: 3,
                        py: 2,
                        lineHeight: 1.8,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {selectedTestimonial.remarks}
                    </Typography>
                    <FormatQuote
                      sx={{
                        fontSize: 40,
                        color: 'primary.main',
                        opacity: 0.2,
                        position: 'absolute',
                        bottom: -10,
                        right: -10,
                        transform: 'rotate(180deg)'
                      }}
                    />
                  </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    onClick={() => setSelectedTestimonial(null)}
                    variant="contained"
                    sx={{ px: 4 }}
                  >
                    Close
                  </Button>
                </DialogActions>
              </>
            );
          })()}
        </Dialog>
      </Container>
    </React.Fragment>
  );
};

export default TestimonialsDetails;
