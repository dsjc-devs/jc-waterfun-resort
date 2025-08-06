import PropTypes from 'prop-types';

// material-ui
import { alpha } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';

// utils
import getDropzoneData from 'utils/getDropzoneData';

// ==============================|| DROPZONE - REJECTION FILES ||============================== //

export default function RejectionFiles({ fileRejections, maxSize }) {
  const formatFileSize = (sizeInBytes) => {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;

    while (sizeInBytes >= 1024 && index < units.length - 1) {
      sizeInBytes /= 1024;
      index++;
    }

    return `${sizeInBytes.toFixed(2)} ${units[index]}`;
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = getDropzoneData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? formatFileSize(size) : ''}
            </Typography>

            {errors.map((error) => (
              <Box key={error.code} component="li" sx={{ typography: 'caption' }}>
                {
                  {
                    'file-invalid-type': 'File type not supported',
                    'file-too-large': `File is too large. Max size is ${formatFileSize(maxSize)}`,
                    'too-many-files': 'Too many files',
                    'file-too-small': 'File is too small'
                  }[error.code] || error.message
                }
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}

RejectionFiles.propTypes = {
  fileRejections: PropTypes.array
};
