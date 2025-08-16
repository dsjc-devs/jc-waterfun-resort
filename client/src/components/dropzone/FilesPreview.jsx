import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemText, ListItem, Link } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';

// utils
import getDropzoneData from 'utils/getDropzoneData';

// assets
import { CloseCircleFilled, FileFilled } from '@ant-design/icons';

// ==============================|| MULTI UPLOAD - PREVIEW ||============================== //

export default function FilesPreview({ showList = false, files, onRemove, type, sx }) {
  const theme = useTheme();
  const hasFile = files.length > 0;
  const layoutType = type;

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
    <List
      disablePadding
      sx={{
        ...(hasFile && layoutType !== 'STANDARD' && { my: 3 }),
        ...(layoutType === 'STANDARD' && { width: 'calc(100% - 84px)' }),
        ...sx
      }}
    >
      {files.map((file, index) => {
        const { key, name, size, preview, type } = getDropzoneData(file, index);

        if (showList) {
          return (
            <ListItem
              key={key}
              sx={{
                p: 0,
                m: 0.5,
                width: layoutType === 'STANDARD' ? 64 : 80,
                height: layoutType === 'STANDARD' ? 64 : 80,
                borderRadius: 1.25,
                position: 'relative',
                display: 'inline-flex',
                verticalAlign: 'text-top',
                border: `solid 1px ${theme.palette.divider}`,
                overflow: 'hidden'
              }}
            >
              <img alt="preview" src={preview} style={{ width: '100%' }} />
              {!type?.includes('image') && (
                <FileFilled
                  style={{ width: '100%', fontSize: '1.5rem', justifyContent: 'center' }}
                />
              )}

              {onRemove && (
                <IconButton
                  size="small"
                  color="error"
                  shape="rounded"
                  onClick={() => onRemove(file)}
                  sx={{
                    fontSize: '0.875rem',
                    bgcolor: 'background.paper',
                    p: 0,
                    width: 'auto',
                    height: 'auto',
                    top: 2,
                    right: 2,
                    position: 'absolute'
                  }}
                >
                  <CloseCircleFilled />
                </IconButton>
              )}

            </ListItem>
          );
        }

        return (
          <ListItem
            key={key}
            sx={{
              my: 1,
              px: 2,
              py: 0.75,
              borderRadius: 0.75,
              border: (theme) => `solid 1px ${theme.palette.divider}`
            }}
          >
            <FileFilled
              style={{ width: '30px', height: '30px', fontSize: '1.15rem', marginRight: 4 }}
            />

            <ListItemText
              primary={
                typeof file === 'string' ? (
                  <Link href={file} target="_blank">
                    {file}
                  </Link>
                ) : (
                  name
                )
              }
              secondary={typeof file === 'string' ? '' : formatFileSize(size)}
              primaryTypographyProps={{ variant: 'subtitle2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />

            {onRemove && size && (
              <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
              </IconButton>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}

FilesPreview.propTypes = {
  showList: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  type: PropTypes.string,
  sx: PropTypes.object
};
