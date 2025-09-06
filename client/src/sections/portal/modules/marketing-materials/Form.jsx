import React from 'react';
import {
    Box,
    Button,
    Chip,
    DialogContent,
    DialogActions,
    Grid,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import SingleFileUpload from 'components/dropzone/FileUpload';
import MultiFileUpload from 'components/dropzone/MultiFile';
import FormWrapper from 'components/FormWrapper';
import MainCard from 'components/MainCard';
import Editor from 'components/Editor';

const statusLabels = {
    POSTED: 'Posted',
    UNPUBLISHED: 'Unpublished',
    ARCHIVED: 'Archived'
};

const MarketingMaterialForm = ({
    initialValues,
    editingMarketingMaterial,
    onSubmit,
    onCancel,
    loading,
    data
}) => {

    const [attachmentsToRemove, setAttachmentsToRemove] = React.useState([]);

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            title: Yup.string().trim().required('Title is required'),
            thumbnail: Yup.string().trim().required('Thumbnail is required'),
            status: Yup.string().required('Status is required'),
            content: Yup.string().required('Content is required')
        }),
        enableReinitialize: true,
        onSubmit
    });

    const handleRemoveExistingAttachment = (attachment) => {
        const updatedExisting = formik.values.existingAttachments.filter(
            (att) => att._id !== attachment._id
        );
        formik.setFieldValue('existingAttachments', updatedExisting);

        setAttachmentsToRemove((prev) => [...prev, attachment]);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <DialogContent>
                <FormWrapper
                    title={editingMarketingMaterial ? 'Edit Marketing Material' : 'Add New Marketing Material'}
                    caption="Please fill out the form below."
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>Thumbnail (Required)</Typography>
                            <SingleFileUpload
                                fieldName="thumbnail"
                                file={formik.values.thumbnail}
                                setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                            />
                            {formik.touched.thumbnail && formik.errors.thumbnail && (
                                <Typography color="error">{formik.errors.thumbnail}</Typography>
                            )}
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
                                    content={{ ...formik.getFieldProps('content'), value: data?.content || formik.values.content }}
                                    formik={formik.setFieldValue}
                                    field='content'
                                />
                            </MainCard>
                            {formik.touched.content && formik.errors.content && (
                                <Typography color="error">{formik.errors.content}</Typography>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography mt={2}>Status</Typography>
                            <TextField
                                select
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                fullWidth
                            >
                                {Object.entries(statusLabels).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Existing attachments */}
                        <Grid item xs={12}>
                            <Typography mt={2}>Existing Attachments</Typography>
                            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                                {formik.values.existingAttachments && formik.values.existingAttachments.length > 0 ? (
                                    formik.values.existingAttachments.map((attachment, index) => (
                                        <Chip
                                            key={attachment._id || index}
                                            label={attachment.fileName || attachment} // Fix here: use fileName string
                                            onDelete={() => handleRemoveExistingAttachment(attachment)}
                                            color="info"
                                        />
                                    ))
                                ) : (
                                    <Typography>No existing attachments</Typography>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography mt={2}>Attachments</Typography>
                            <MultiFileUpload
                                setFieldValue={formik.setFieldValue}
                                files={formik.values.files || []}
                                onRemove={(file) => {
                                    const updatedFiles = formik.values.files.filter(f => f !== file);
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
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                    {editingMarketingMaterial ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </form>
    );
};

export default MarketingMaterialForm;
