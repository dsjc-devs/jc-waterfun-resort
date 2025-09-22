import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    useTheme,
    useMediaQuery,
    ToggleButtonGroup,
    ToggleButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Box,
    Grid,
    Stack,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Autocomplete,
    IconButton,
    Skeleton
} from '@mui/material';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Close,
    ZoomIn,
    ViewModule,
    Category as CategoryIcon,
    ArrowBackIos,
    ArrowForwardIos
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useGetGallery, addGallery, deleteGallery } from 'api/gallery';

import ConfirmationDialog from 'components/ConfirmationDialog';
import SingleFileUpload from 'components/dropzone/FileUpload';

const GalleryList = ({
    isOnPortal = false,
    queryObj = {}
}) => {
    const { data, isLoading, mutate } = useGetGallery(queryObj) || {};
    const galleryImages = data?.galleryImages || [];
    const totalImages = data?.totalImages || galleryImages.length;

    const [viewItem, setViewItem] = useState(null);
    const tempObjectURLsRef = useRef([]);
    useEffect(() => () => tempObjectURLsRef.current.forEach(u => URL.revokeObjectURL(u)), []);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [addForm, setAddForm] = useState({ category: '', image: null });
    const [categoryError, setCategoryError] = useState('');

    const handleViewModeChange = (event, newMode) => {
        if (newMode !== null) {
            setViewMode(newMode);
            if (newMode === 'categorized') setSelectedCategory('ALL');
        }
    };

    const existingCategories = useMemo(() => {
        const set = new Set();
        galleryImages.forEach(i => i.category && set.add(i.category));
        return Array.from(set);
    }, [galleryImages]);

    const openAdd = () => {
        setAddForm({ category: '', image: null });
        setCategoryError('');
        setAddOpen(true);
    };
    const closeAdd = () => !saving && setAddOpen(false);

    const handleDelete = async () => {
        if (!deleteTarget?._id) return;
        try {
            await deleteGallery(deleteTarget._id);
            toast.success('Image deleted');
            mutate && (await mutate());
        } catch (e) {
            toast.error(e?.message || 'Delete failed');
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const category = addForm.category.trim();
        if (!category) {
            setCategoryError('Category is required');
            return;
        }
        if (!addForm.image) {
            toast.error('Image is required');
            return;
        }
        setSaving(true);
        try {
            const file = addForm.image.file || addForm.image;
            const fd = new FormData();
            fd.append('category', category);
            fd.append('image', file);
            const res = await addGallery(fd);
            const created = res?.data?.data || null;
            if (!created?._id) {
                const url = URL.createObjectURL(file);
                tempObjectURLsRef.current.push(url);
            }
            toast.success('Image added');
            setAddOpen(false);
            mutate && (await mutate());
        } catch (err) {
            toast.error(err?.message || 'Add failed');
        } finally {
            setSaving(false);
        }
    };

    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [viewMode, setViewMode] = useState('categorized');
    const categories = useMemo(() => {
        if (!galleryImages.length) return ['ALL'];
        return ['ALL', ...new Set(galleryImages.map(i => i.category || 'UNCATEGORIZED'))];
    }, [galleryImages]);

    const filteredImages = useMemo(() => {
        if (!galleryImages.length) return [];
        if (selectedCategory === 'ALL') return galleryImages;
        return galleryImages.filter(i => (i.category || 'UNCATEGORIZED') === selectedCategory);
    }, [galleryImages, selectedCategory]);

    const imagesByCategory = useMemo(() => {
        if (!galleryImages.length) return {};
        return galleryImages.reduce((acc, img) => {
            const cat = img.category || 'UNCATEGORIZED';
            (acc[cat] ||= []).push(img);
            return acc;
        }, {});
    }, [galleryImages]);

    const currentImageIndex = useMemo(() => {
        if (!viewItem) return -1;
        const list = viewMode === 'categorized' ? galleryImages : filteredImages;
        return list.findIndex(i => i._id === viewItem._id);
    }, [viewItem, galleryImages, filteredImages, viewMode]);

    const clientVisibleCount = useMemo(
        () => (viewMode === 'categorized' ? galleryImages : filteredImages).length,
        [galleryImages, filteredImages, viewMode]
    );

    const handlePrev = () => {
        if (currentImageIndex > 0) {
            const list = viewMode === 'categorized' ? galleryImages : filteredImages;
            setViewItem(list[currentImageIndex - 1]);
        }
    };
    const handleNext = () => {
        const list = viewMode === 'categorized' ? galleryImages : filteredImages;
        if (currentImageIndex < list.length - 1) setViewItem(list[currentImageIndex + 1]);
    };

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    const imageListCols = isXs ? 1 : isSm ? 2 : isMd ? 3 : 4;
    const imageRowHeight = isXs ? 300 : isSm ? 200 : isMd ? 240 : 300;

    const handleImageClick = (image) => setViewItem(image);

    return (
        <Box>
            {isOnPortal &&
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button variant="contained" startIcon={<PlusOutlined />} onClick={openAdd}>Add Image</Button>
                </Box>
            }

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="view mode selection"
                    sx={{
                        borderRadius: 3,
                        background: '#fff',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        p: 0.5,
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <ToggleButton
                        value="categorized"
                        aria-label="categorized view"
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            backgroundColor: viewMode === 'categorized' ? '#2a93c1' : '#fff',
                            color: viewMode === 'categorized' ? '#fff' : '#2a93c1',
                            fontWeight: 700,
                            fontFamily: 'Poppins',
                            border: 'none',
                            '&:hover': {
                                backgroundColor: viewMode === 'categorized' ? '#1e7a9a' : '#e8f5fd',
                            },
                        }}
                    >
                        <CategoryIcon sx={{ mr: 1 }} />
                        Categorized
                    </ToggleButton>
                    <ToggleButton
                        value="all"
                        aria-label="all images view"
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            backgroundColor: viewMode === 'all' ? '#2a93c1' : '#fff',
                            color: viewMode === 'all' ? '#fff' : '#2a93c1',
                            fontWeight: 700,
                            fontFamily: 'Poppins',
                            border: 'none',
                            '&:hover': {
                                backgroundColor: viewMode === 'all' ? '#1e7a9a' : '#e8f5fd',
                            },
                        }}
                    >
                        <ViewModule sx={{ mr: 1 }} />
                        All Images
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <React.Fragment>
                {viewMode === 'all' &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 6 }}>
                        {categories.map(cat => (
                            <Chip
                                key={cat}
                                label={cat.replace('_', ' ')}
                                onClick={() => setSelectedCategory(cat)}
                                variant={selectedCategory === cat ? 'filled' : 'outlined'}
                                sx={{
                                    backgroundColor: selectedCategory === cat ? '#2a93c1' : 'transparent',
                                    color: selectedCategory === cat ? '#fff' : '#2a93c1',
                                    fontWeight: 700,
                                    fontFamily: 'Poppins',
                                    px: 3,
                                    py: 1,
                                    fontSize: '0.9rem',
                                    border: '2px solid #2a93c1',
                                    '&:hover': {
                                        backgroundColor: selectedCategory === cat ? '#1e7a9a' : '#e8f5fd'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                }

                {isLoading &&
                    <Grid container spacing={2}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                                    <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, borderRadius: 3, height: '100%', width: '100%' }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                }

                {!isLoading && !galleryImages.length &&
                    <Box sx={{ textAlign: 'center', py: 8, background: '#fff', borderRadius: 3, boxShadow: 2 }}>
                        <Typography variant="h5" color="#634131" fontFamily="Poppins" fontWeight={600} mb={2}>No images found</Typography>
                        <Typography variant="body1" color="#634131">No images available in the gallery yet.</Typography>
                    </Box>
                }

                {!isLoading && galleryImages.length > 0 && viewMode === 'categorized' &&
                    Object.entries(imagesByCategory).map(([category, images]) => (
                        <Box key={category} sx={{ mb: { xs: 3, md: 8 } }}>
                            <Typography
                                variant="h4"
                                fontWeight={900}
                                fontFamily="Poppins"
                                color="#2a93c1"
                                mb={4}
                                sx={{
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: 2,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 100,
                                        height: 4,
                                        background: 'linear-gradient(90deg, #2a93c1 0%, #f29023 100%)',
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                {category.replace('_', ' ')}
                            </Typography>
                            <ImageList
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    pb: 2,
                                    gap: 0,
                                }}
                                cols={imageListCols}
                                rowHeight={imageRowHeight}
                                gap={isXs ? 8 : 16}
                            >
                                {images.map((image, index) => (
                                    <ImageListItem
                                        key={image._id}
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            bgcolor: '#fff',
                                            m: 0.5,
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                                                '& .overlay': {
                                                    opacity: 1,
                                                },
                                                '& img': {
                                                    transform: 'scale(1.04)',
                                                },
                                            },
                                        }}
                                        onClick={() => handleImageClick(image)}
                                    >
                                        <Box sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#f4e8cf'
                                        }}>
                                            <img
                                                src={image.image}
                                                alt={`${category} ${index + 1}`}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    aspectRatio: isXs ? '1/1' : '4/3',
                                                    borderRadius: 12,
                                                    transition: 'transform 0.3s ease',
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    background: '#fff'
                                                }}
                                            />
                                        </Box>
                                        <Box
                                            className="overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(135deg, rgba(42,147,193,0.8) 0%, rgba(242,144,35,0.8) 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                            }}
                                        >
                                            <ZoomIn sx={{ color: '#fff', fontSize: 48 }} />
                                        </Box>
                                        {isOnPortal &&
                                            <Button
                                                color='error'
                                                variant='contained'
                                                size='small'
                                                startIcon={<DeleteOutlined />}
                                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(image); }}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    right: 8,
                                                    fontWeight: 600,
                                                    px: 1.5,
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        }
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    ))
                }

                {!isLoading && galleryImages.length > 0 && viewMode === 'all' &&
                    <ImageList
                        sx={{
                            width: '100%',
                            height: 'auto',
                            pb: 2,
                            gap: 0,
                        }}
                        cols={imageListCols}
                        rowHeight={imageRowHeight}
                        gap={isXs ? 8 : 16}
                    >
                        {filteredImages.map((image, index) => (
                            <ImageListItem
                                key={image._id}
                                sx={{
                                    cursor: 'pointer',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    bgcolor: '#fff',
                                    m: 0.5,
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                                        '& .overlay': {
                                            opacity: 1,
                                        },
                                        '& img': {
                                            transform: 'scale(1.04)',
                                        },
                                    },
                                }}
                                onClick={() => handleImageClick(image)}
                            >
                                <Box sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: '#f4e8cf'
                                }}>
                                    <img
                                        src={image.image}
                                        alt={`Gallery image ${index + 1}`}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            aspectRatio: isXs ? '1/1' : '4/3',
                                            borderRadius: 12,
                                            transition: 'transform 0.3s ease',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            background: '#fff'
                                        }}
                                    />
                                </Box>
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'linear-gradient(135deg, rgba(42,147,193,0.8) 0%, rgba(242,144,35,0.8) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                >
                                    <ZoomIn sx={{ color: '#fff', fontSize: 48 }} />
                                </Box>
                                <ImageListItemBar
                                    sx={{
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                        '& .MuiImageListItemBar-title': {
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontFamily: 'Poppins',
                                            fontSize: '0.85rem',
                                        },
                                    }}
                                    title={(image.category || 'UNCATEGORIZED').replace('_', ' ')}
                                    position="top"
                                />
                                {isOnPortal &&
                                    <Button
                                        color='error'
                                        variant='contained'
                                        size='small'
                                        startIcon={<DeleteOutlined />}
                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(image); }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            fontWeight: 600,
                                            px: 1.5,
                                        }}
                                    >
                                        Delete
                                    </Button>
                                }
                            </ImageListItem>
                        ))}
                    </ImageList>
                }
            </React.Fragment>

            {!isLoading && galleryImages.length > 0 &&
                <Box sx={{ mt: 3 }}>
                    <Stack alignItems="center" spacing={0.5}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Total Images: {totalImages}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            All gallery images loaded
                        </Typography>
                    </Stack>
                </Box>
            }

            <Dialog
                open={Boolean(viewItem)}
                onClose={() => setViewItem(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        onClick={() => setViewItem(null)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            zIndex: 10,
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                        }}
                    >
                        <Close />
                    </IconButton>
                    {currentImageIndex > 0 &&
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: 16,
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                zIndex: 10,
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                            }}
                        >
                            <ArrowBackIos />
                        </IconButton>
                    }
                    {currentImageIndex < totalImages - 1 &&
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: 16,
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                zIndex: 10,
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                            }}
                        >
                            <ArrowForwardIos />
                        </IconButton>
                    }
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            fontFamily: 'Poppins',
                            fontSize: '0.9rem',
                            zIndex: 10
                        }}
                    >
                        {currentImageIndex + 1} / {clientVisibleCount}
                    </Box>
                    {viewItem &&
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: { xs: '40vh', md: '60vh' },
                            maxHeight: { xs: '70vh', md: '90vh' },
                            p: { xs: 1, md: 2 }
                        }}>
                            <img
                                src={viewItem.image}
                                alt="Full size gallery"
                                style={{
                                    width: isXs ? '90vw' : '100%',
                                    height: isXs ? '90vw' : 'auto',
                                    maxHeight: isXs ? '90vw' : '65vh',
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                    maxWidth: '100vw',
                                    aspectRatio: isXs ? '1/1' : '4/3',
                                    background: '#fff'
                                }}
                            />
                        </Box>
                    }
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                title="Delete Image"
                description="Are you sure you want to delete this image?"
                open={Boolean(deleteTarget)}
                handleConfirm={handleDelete}
                handleClose={() => setDeleteTarget(null)}
            />

            <Dialog
                open={addOpen}
                onClose={closeAdd}
                fullWidth
                maxWidth="sm"
                component="form"
                onSubmit={handleAddSubmit}
            >
                <DialogTitle>Add Image</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} mt={1}>
                        <Box>
                            <Typography variant="subtitle2" mb={0.5}>Category (Required)</Typography>
                            <Autocomplete
                                freeSolo
                                options={existingCategories}
                                value={addForm.category}
                                onChange={(_, v) => {
                                    setAddForm(p => ({ ...p, category: v || '' }));
                                    setCategoryError('');
                                }}
                                onInputChange={(_, v) => {
                                    setAddForm(p => ({ ...p, category: v }));
                                    if (v.trim()) setCategoryError('');
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Type or select category"
                                        error={Boolean(categoryError)}
                                        helperText={categoryError || 'Select existing or type to add new'}
                                    />
                                )}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" mb={0.5}>Image (Required)</Typography>
                            <SingleFileUpload
                                fieldName="image"
                                file={addForm.image}
                                setFieldValue={(_, v) => setAddForm(p => ({ ...p, image: v }))}
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAdd} disabled={saving}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GalleryList;