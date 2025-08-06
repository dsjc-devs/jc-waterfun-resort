import PropTypes from 'prop-types';

// Material-UI
import { CameraOutlined } from '@ant-design/icons';
import { Typography, Stack, CardMedia } from '@mui/material';

// Assets
import UploadCover from 'assets/images/upload/upload.svg';

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

export default function PlaceholderContent({ type, isSingleFile = false, isRound = false }) {
  return (
    <>
      {type !== 'STANDARD' && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={isRound ? 'column' : { xs: 'column', md: 'row' }}
          sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: isRound ? 50 : 150 }} />
          <Stack sx={{ p: 3 }} spacing={1}>
            <Typography
              variant="h5"
              sx={{ fontSize: isRound ? '0.875rem' : '1rem', textAlign: isRound && 'center' }} // Adjust font size if isRound
            >
              {isSingleFile ? 'Drag & Drop or Select a file' : 'Drag & Drop or Select files'}
            </Typography>

            <Typography color="secondary" sx={{ fontSize: isRound ? '0.75rem' : '0.875rem', textAlign: isRound && 'center' }}>
              {isSingleFile ? 'Drop a file here or click' : 'Drop files here or click'}&nbsp;
              <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                browse
              </Typography>
              &nbsp;through your machine
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === 'STANDARD' && (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <CameraOutlined style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}

PlaceholderContent.propTypes = {
  type: PropTypes.string,
  isSingleFile: PropTypes.bool,
  isRound: PropTypes.bool // Add prop type for isRound
};
