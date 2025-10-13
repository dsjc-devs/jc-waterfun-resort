import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    Avatar,
    Rating,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Skeleton,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
    Divider,
    LinearProgress,
    Pagination,
    MenuItem,
} from '@mui/material';
import { USER_ROLES } from 'constants/constants';
import { useGetTestimonials } from 'api/testimonials';
import { toast } from 'react-toastify';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormatQuote from '@mui/icons-material/FormatQuote';
import useAuth from 'hooks/useAuth';
import testimonialsApi from 'api/testimonials';
import ConfirmationDialog from 'components/ConfirmationDialog';

const TabPanel = ({ value, index, children }) => {
    if (value !== index) return null;
    return <Box mt={2}>{children}</Box>;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const TestimonialRow = ({ t, onApprove, onUnpublish, onDelete, onView }) => {
    const fullName = `${t.firstName} ${t.lastName}`;
    const initials = `${t.firstName?.[0] || ''}${t.lastName?.[0] || ''}`;
    const isTruncated = t.remarks && t.remarks.length > 200;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }
            }}
            onClick={(e) => {
                // Don't trigger if clicking action buttons
                if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
                    onView(t);
                }
            }}
        >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: { sm: 220 }, flexShrink: 0 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#0B4F71', fontWeight: 600 }}>{initials}</Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>{fullName}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Rating value={t.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#f6b600' } }} />
                            <Typography variant="caption" color="text.secondary" noWrap>{formatDate(t.createdAt)}</Typography>
                        </Stack>
                    </Box>
                </Stack>

                <Box flex={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word'
                        }}
                    >
                        {t.remarks && t.remarks.length > 200 ? `${t.remarks.slice(0, 200)}...` : t.remarks}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Chip label={t.isPosted ? 'Published' : 'Pending'} size="small" color={t.isPosted ? 'success' : 'warning'} variant="outlined" />
                    {t.isPosted ? (
                        <Tooltip title="Unpublish">
                            <IconButton color="warning" size="small" onClick={(e) => { e.stopPropagation(); onUnpublish(t); }}>
                                <UndoIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Approve & Publish">
                            <IconButton color="success" size="small" onClick={(e) => { e.stopPropagation(); onApprove(t); }}>
                                <CheckCircleOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Delete">
                        <IconButton color="error" size="small" onClick={(e) => { e.stopPropagation(); onDelete(t); }}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
        </Paper>
    );
};

const TestimonialsAdmin = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState(0);
    const [confirm, setConfirm] = useState({ open: false, item: null });
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [minRating, setMinRating] = useState(0);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selected, setSelected] = useState(new Set());

    useEffect(() => {
        const id = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
        return () => clearTimeout(id);
    }, [search]);

    const serverQuery = useMemo(() => {
        const q = { page, limit };
        if (tab === 0) q.isPosted = false;
        else if (tab === 1) q.isPosted = true;
        return q;
    }, [page, limit, tab]);

    const { data, isLoading, mutate } = useGetTestimonials(serverQuery);
    const items = data?.testimonials || [];
    const totalPages = data?.totalPages || 1;

    const filtered = useMemo(() => {
        const matches = (t) => {
            if (minRating && (t.rating || 0) < minRating) return false;
            if (debouncedSearch) {
                const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
                const email = (t.emailAddress || '').toLowerCase();
                const remarks = (t.remarks || '').toLowerCase();
                if (!fullName.includes(debouncedSearch) && !email.includes(debouncedSearch) && !remarks.includes(debouncedSearch)) return false;
            }
            if (dateFrom) {
                const from = new Date(dateFrom);
                if (new Date(t.createdAt) < from) return false;
            }
            if (dateTo) {
                const to = new Date(dateTo);
                // include whole day
                to.setHours(23, 59, 59, 999);
                if (new Date(t.createdAt) > to) return false;
            }
            return true;
        };
        return items.filter(matches);
    }, [items, debouncedSearch, minRating, dateFrom, dateTo]);

    const userRole = user?.position?.[0]?.value || user?.role || null;
    const isAllowed = userRole === USER_ROLES.MASTER_ADMIN.value || userRole === USER_ROLES.ADMIN.value;

    const handleApprove = async (t) => {
        try {
            await testimonialsApi.TESTIMONIALS.editTestimonial(t.testimonialId, { isPosted: true });
            toast.success('Testimonial published');
            mutate();
        } catch (e) {
            toast.error(e?.message || 'Failed to publish');
        }
    };

    const handleUnpublish = async (t) => {
        try {
            await testimonialsApi.TESTIMONIALS.editTestimonial(t.testimonialId, { isPosted: false });
            toast.info('Testimonial unpublished');
            mutate();
        } catch (e) {
            toast.error(e?.message || 'Failed to unpublish');
        }
    };

    const handleDelete = (t) => setConfirm({ open: true, item: t });
    const closeConfirm = () => setConfirm({ open: false, item: null });
    const confirmDelete = async () => {
        const t = confirm.item;
        if (!t) return;
        try {
            await testimonialsApi.TESTIMONIALS.deleteTestimonial(t.testimonialId);
            toast.success('Testimonial deleted');
            closeConfirm();
            mutate();
            setSelected((prev) => {
                const next = new Set(prev);
                next.delete(t.testimonialId);
                return next;
            });
        } catch (e) {
            toast.error(e?.message || 'Failed to delete');
        }
    };

    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };
    const clearSelection = () => setSelected(new Set());

    const bulkApprove = async () => {
        if (selected.size === 0) return;
        try {
            await Promise.all([...selected].map(id => testimonialsApi.TESTIMONIALS.editTestimonial(id, { isPosted: true })));
            toast.success('Selected testimonials published');
            clearSelection();
            mutate();
        } catch (e) { toast.error(e?.message || 'Bulk publish failed'); }
    };
    const bulkUnpublish = async () => {
        if (selected.size === 0) return;
        try {
            await Promise.all([...selected].map(id => testimonialsApi.TESTIMONIALS.editTestimonial(id, { isPosted: false })));
            toast.info('Selected testimonials unpublished');
            clearSelection();
            mutate();
        } catch (e) { toast.error(e?.message || 'Bulk unpublish failed'); }
    };
    const bulkDelete = async () => {
        if (selected.size === 0) return;
        try {
            await Promise.all([...selected].map(id => testimonialsApi.TESTIMONIALS.deleteTestimonial(id)));
            toast.success('Selected testimonials deleted');
            clearSelection();
            mutate();
        } catch (e) { toast.error(e?.message || 'Bulk delete failed'); }
    };

    if (!isAllowed) {
        return (
            <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
                <Typography variant="h5" color="text.secondary">You don't have permission to manage testimonials.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 8 }}>
            <Tabs
                value={tab}
                onChange={(_, v) => { setTab(v); setPage(1); clearSelection(); }}
                aria-label="testimonial tabs"
                sx={{ mb: 2 }}
            >
                <Tab label={`Pending (${items.filter(i => !i.isPosted).length})`} />
                <Tab label={`Published (${items.filter(i => i.isPosted).length})`} />
                <Tab label={`All (${items.length})`} />
            </Tabs>

            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                    <TextField
                        label="Search name/email/message"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Min rating"
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        sx={{ minWidth: 160 }}
                    >
                        {[0, 1, 2, 3, 4, 5].map(v => (
                            <MenuItem key={v} value={v}>{v === 0 ? 'Any' : `${v}+`}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="From"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 180 }}
                    />
                    <TextField
                        label="To"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 180 }}
                    />
                    <TextField
                        select
                        label="Rows"
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        sx={{ width: 110 }}
                    >
                        {[5, 10, 20, 50].map(v => (<MenuItem key={v} value={v}>{v}</MenuItem>))}
                    </TextField>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'center' }}>
                    <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                        <Button variant="contained" color="success" onClick={bulkApprove} disabled={selected.size === 0}>Approve Selected</Button>
                        <Button variant="outlined" color="warning" onClick={bulkUnpublish} disabled={selected.size === 0}>Unpublish Selected</Button>
                        <Button variant="outlined" color="error" onClick={bulkDelete} disabled={selected.size === 0}>Delete Selected</Button>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{selected.size} selected</Typography>
                </Stack>
            </Paper>

            {isLoading && <LinearProgress sx={{ mb: 2 }} />}

            {isLoading ? (
                <Stack spacing={2}>{[1, 2, 3].map(i => (
                    <Paper key={i} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <Skeleton variant="circular" width={48} height={48} />
                            <Box flex={1}>
                                <Skeleton variant="text" width="40%" height={28} />
                                <Skeleton variant="text" width="80%" height={22} />
                            </Box>
                        </Stack>
                    </Paper>
                ))}</Stack>
            ) : (
                <TabPanel value={tab} index={tab}>
                    <Stack spacing={1.5}>
                        {filtered.length === 0 ? (
                            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">No items found in this view.</Typography>
                            </Paper>
                        ) : (
                            filtered.map(t => (
                                <Box key={t.testimonialId}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={selected.has(t.testimonialId)} onChange={() => toggleSelect(t.testimonialId)} />}
                                            label=""
                                        />
                                        <Box flex={1}>
                                            <TestimonialRow
                                                t={t}
                                                onApprove={handleApprove}
                                                onUnpublish={handleUnpublish}
                                                onDelete={handleDelete}
                                                onView={setSelectedTestimonial}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>
                            ))
                        )}
                        <Stack direction="row" justifyContent="center" mt={1}>
                            <Pagination color="primary" page={page} count={totalPages} onChange={(_, v) => { setPage(v); clearSelection(); }} />
                        </Stack>
                    </Stack>
                </TabPanel>
            )}

            <ConfirmationDialog
                open={confirm.open}
                handleClose={closeConfirm}
                title="Delete Testimonial?"
                description="This action cannot be undone. Are you sure you want to delete this testimonial?"
                handleConfirm={confirmDelete}
            />

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
                {selectedTestimonial && (
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
                                    <Stack direction="row" justifyContent="center" mt={1} spacing={1} alignItems="center">
                                        <Rating
                                            value={selectedTestimonial.rating}
                                            readOnly
                                            size="small"
                                            sx={{ '& .MuiRating-iconFilled': { color: '#f6b600' } }}
                                        />
                                        <Chip
                                            label={selectedTestimonial.isPosted ? 'Published' : 'Pending'}
                                            size="small"
                                            color={selectedTestimonial.isPosted ? 'success' : 'warning'}
                                            variant="outlined"
                                        />
                                    </Stack>
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
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                                Submitted on {formatDate(selectedTestimonial.createdAt)}
                            </Typography>
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
                )}
            </Dialog>
        </Container>
    );
};

export default TestimonialsAdmin;
