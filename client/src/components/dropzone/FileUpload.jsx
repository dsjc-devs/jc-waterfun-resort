import PropTypes from 'prop-types';

// Material-UI
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';

// Third-party
import { useDropzone } from 'react-dropzone';

// Project import
import RejectionFiles from './RejectionFiles';
import PlaceholderContent from './PlaceholderContent';

const DropzoneWrapper = styled('div')(({ theme, isRound }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: isRound ? '50%' : theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  width: isRound && '250px',
  height: isRound && '250px',
  objectFit: 'cover',
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

const SingleFileUpload = ({
  error,
  file,
  setFieldValue,
  sx,
  fieldName = 'files',
  maxFileSize = 20,
  isRound = false,
}) => {
  const theme = useTheme();

  const maxSize = maxFileSize * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    maxSize,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.jpg', '.svg'],
      'text/*': ['.txt', '.docx'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFieldValue(fieldName, Object.assign(file, { preview: URL.createObjectURL(file) }));
    },
  });

  const thumb = file && (
    <img
      key={file.name}
      alt={file.name}
      src={file.preview || file}
      style={{
        top: 8,
        left: 8,
        borderRadius: 'inherit',
        position: 'absolute',
        width: 'calc(100% - 16px)',
        height: 'auto', // Maintain aspect ratio
        background: theme.palette.background.paper,
        objectFit: 'cover',
        maxHeight: '100%',
        maxWidth: '100%',
      }}
      onLoad={() => {
        URL.revokeObjectURL(file.preview);
      }}
    />
  );

  const onRemove = () => {
    setFieldValue(fieldName, null);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        isRound={isRound}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(file && {
            padding: '12% 0',
          }),
        }}
      >
        <input {...getInputProps()} />
        <PlaceholderContent isSingleFile isRound={isRound} />
        {thumb}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} maxSize={maxSize} />}

      {file && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={onRemove}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

SingleFileUpload.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setFieldValue: PropTypes.func,
  sx: PropTypes.object,
  isRound: PropTypes.bool,
};

export default SingleFileUpload;
