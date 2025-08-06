import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import RejectionFiles from './RejectionFiles';
import PlaceholderContent from './PlaceholderContent';
import FilesPreview from './FilesPreview';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - MULTIPLE FILE ||============================== //

/**
 * Component for uploading multiple files with dropzone functionality.
 *
 * @component
 * @param {string} error - The error message, if any.
 * @param {boolean} showList - Whether to show the list of uploaded files.
 * @param {Array} files - The array of uploaded files.
 * @param {function} setFieldValue - The function to set the field value.
 * @param {object} sx - The custom styling object.
 * @param {string} type - The type of file upload.
 * @param {function} onUpload - The function to handle file upload.
 * @param {boolean} hideButton - Whether to hide the upload button.
 * @returns {JSX.Element} The MultiFileUpload component.
 */

const fileTypes = {
  'image/*': ['.jpeg', '.png', '.gif', '.jpg', '.svg'],
  'text/*': ['.txt', '.docx'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'audio/mpeg': ['.mp3'],
  'video/mp4': ['.mp4']
}

const MultiFileUpload = ({
  error,
  showList = false,
  files,
  setFieldValue,
  sx,
  type,
  onUpload,
  hideButton,
  maxFileSize = 20, // 20MB
  multiple = true,
  acceptedFileTypes = fileTypes
}) => {
  const maxSize = maxFileSize * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    maxSize,
    multiple,
    accept: acceptedFileTypes,
    onDrop: (acceptedFiles) => {
      if (files) {
        setFieldValue('files', [
          ...files,
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        ]);
      } else {
        setFieldValue(
          'files',
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
      }
    }
  });

  const onRemoveAll = () => {
    setFieldValue('files', null);
  };

  const onRemove = (file) => {
    const filteredItems = files && files.filter((_file) => _file !== file);
    setFieldValue('files', filteredItems);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          ...(type === 'STANDARD' && { width: 'auto', display: 'flex' }),
          ...sx
        }}
      >
        <Stack {...(type === 'STANDARD' && { alignItems: 'center' })}>
          <DropzoneWrapper
            {...getRootProps()}
            sx={{
              ...(type === 'STANDARD' && {
                p: 0,
                m: 1,
                width: 64,
                height: 64
              }),
              ...(isDragActive && { opacity: 0.72 }),
              ...((isDragReject || error) && {
                color: 'error.main',
                borderColor: 'error.light',
                bgcolor: 'error.lighter'
              })
            }}
          >
            <input {...getInputProps()} />
            <PlaceholderContent type={type} />
          </DropzoneWrapper>
          {type === 'STANDARD' && files && files.length > 1 && (
            <Button variant="contained" color="error" size="extraSmall" onClick={onRemoveAll}>
              Remove all
            </Button>
          )}
        </Stack>
        {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} maxSize={maxSize} />}
        {files && files.length > 0 && (
          <FilesPreview files={files} showList={showList} onRemove={onRemove} type={type} />
        )}
      </Box>

      {!hideButton && type !== 'STANDARD' && files && files.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 1.5 }}>
          <Button color="inherit" size="small" onClick={onRemoveAll}>
            Remove all
          </Button>
          <Button size="small" variant="contained" onClick={onUpload}>
            Upload files
          </Button>
        </Stack>
      )}
    </>
  );
};

MultiFileUpload.propTypes = {
  error: PropTypes.bool,
  showList: PropTypes.bool,
  files: PropTypes.array,
  setFieldValue: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
  type: PropTypes.string,
  maxFileSize: PropTypes.number,
};

export default MultiFileUpload;
