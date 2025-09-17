
import { useGetSingleMarketingMaterial } from "api/marketing-materials";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import agent from "api/marketing-materials";
import FormWrapper from "components/FormWrapper";
import MainCard from "components/MainCard";
import MultiFileUpload from "components/dropzone/MultiFile";
import SingleFileUpload from "components/dropzone/FileUpload";
import Editor from "components/Editor";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import EmptyUserCard from "components/cards/skeleton/EmptyUserCard";

const statusLabels = {
    POSTED: 'Posted',
    UNPUBLISHED: 'Unpublished',
    ARCHIVED: 'Archived'
};

const ArticleForm = ({ id }) => {
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);

    const { data, isLoading, error } = useGetSingleMarketingMaterial(id)
    const material = data

    useEffect(() => {
        if (error) {
            console.error('Error loading article:', error);
            toast.error('Failed to load article');
            navigate('/portal/content-management/articles');
        }
    }, [error, navigate]);

    const getInitialValues = () => {
        if (isEdit && material) {
            return {
                title: material.title || '',
                content: material.content || '',
                thumbnail: material.thumbnail || '',
                status: material.status || 'UNPUBLISHED',
                existingAttachments: material.attachments || [],
                files: []
            };
        }
        return {
            title: '',
            content: '',
            thumbnail: '',
            status: 'UNPUBLISHED',
            existingAttachments: [],
            files: []
        };
    };

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: Yup.object({
            title: Yup.string().trim().required('Title is required'),
            thumbnail: isEdit ? Yup.mixed() : Yup.mixed().required('Thumbnail is required'),
            status: Yup.string().required('Status is required'),
            content: Yup.string().required('Content is required')
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('content', values.content);
                formData.append('status', values.status);

                if (values.thumbnail) {
                    if (typeof values.thumbnail === 'string') {
                        if (values.thumbnail.trim()) formData.append('thumbnailUrl', values.thumbnail);
                    } else {
                        formData.append('thumbnail', values.thumbnail);
                    }
                }

                if (values.files && values.files.length > 0) {
                    values.files.forEach((file) => formData.append('attachments', file));
                }

                if (values.existingAttachments) {
                    formData.append('existingAttachments', JSON.stringify(values.existingAttachments));
                }

                if (isEdit) {
                    await agent.editMarketingMaterial(id, formData);
                    toast.success('Article updated successfully');
                } else {
                    await agent.addMarketingMaterial(formData);
                    toast.success('Article created successfully');
                }
                navigate('/portal/content-management/articles');
            } catch (error) {
                console.error('Error saving article:', error);
                toast.error(error?.message || 'An error occurred while saving the article');
            } finally {
                setLoading(false);
            }
        }
    });

    const handleRemoveExistingAttachment = (attachment) => {
        const updatedExisting = formik.values.existingAttachments.filter((att) => att._id !== attachment._id);
        formik.setFieldValue('existingAttachments', updatedExisting);
    };

    if (isLoading) return <EmptyUserCard title="Loading...." />

    return (
        <form onSubmit={formik.handleSubmit}>
            <DialogContent>
                <FormWrapper
                    title={isEdit ? 'Edit Article' : 'Add New Article'}
                    caption={isEdit ? 'Update only the fields you want to change. Thumbnail is optional during edit.' : 'Please fill out the form below.'}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>Thumbnail {isEdit ? '(Optional during edit)' : '(Required)'}</Typography>
                            <SingleFileUpload
                                fieldName="thumbnail"
                                file={formik.values.thumbnail}
                                setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                            />
                            {formik.touched.thumbnail && formik.errors.thumbnail && <Typography color="error">{formik.errors.thumbnail}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Title (Required)</Typography>
                            <TextField
                                name="title"
                                fullWidth
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Content (Required)</Typography>
                            <MainCard>
                                <Editor
                                    content={{ ...formik.getFieldProps('content'), value: material?.content || formik.values.content }}
                                    formik={formik.setFieldValue}
                                    field="content"
                                />
                            </MainCard>
                            {formik.touched.content && formik.errors.content && <Typography color="error">{formik.errors.content}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography mt={2}>Status</Typography>
                            <TextField select name="status" value={formik.values.status} onChange={formik.handleChange} fullWidth>
                                {Object.entries(statusLabels).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography mt={2}> </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                                {formik.values.existingAttachments && formik.values.existingAttachments.length > 0 ? (
                                    formik.values.existingAttachments.map((attachment, index) => (
                                        <Chip
                                            key={attachment._id || index}
                                            label={attachment.fileName || attachment}
                                            onDelete={() => handleRemoveExistingAttachment(attachment)}
                                            color="info"
                                        />
                                    ))
                                ) : (
                                    <Typography></Typography>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography mt={2}>Attachments</Typography>
                            <MultiFileUpload
                                setFieldValue={formik.setFieldValue}
                                files={formik.values.files || []}
                                onRemove={(file) => {
                                    const updatedFiles = formik.values.files.filter((f) => f !== file);
                                    formik.setFieldValue('files', updatedFiles);
                                }}
                                error={formik.touched.files && !!formik.errors.files}
                                hideButton={true}
                            />
                        </Grid>
                    </Grid>
                </FormWrapper>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => navigate('/portal/content-management/articles')}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={loading}>
                    {isEdit ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </form>
    );
};

export default ArticleForm;
