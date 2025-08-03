import React from 'react';
import { Tooltip, Box, Typography } from '@mui/material';
import 'styles/LabeledValue.css';
import classNames from 'classnames';
import { BLANK_VALUE } from 'constants/constants';

const checkBlankValue = (value) => {
  return value ? value : BLANK_VALUE;
};

function addEllipsis(text, maxLength = 20) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength - 3) + '...';
  }
}

const LabeledValue = (props) => {
  const labelValueClassnames = classNames('label-value', {
    'label-value-bold': props.variant === 'bold',
    'label-value-light': props.variant === 'light',
    'label-value-icon': props.icon,
    'label-value-ellipsis': props.ellipsis
  });

  if (props.isVisible) {
    return (
      <Box className={labelValueClassnames} {...props} sx={{ margin: 1 }}>
        {props.icon ? (
          <React.Fragment>
            <Box className="icon">{props.icon}</Box>
            <Box className="caption">
              <Typography variant="h5">{props.title}</Typography>
              {props.ellipsis && props.subTitle ? (
                <Tooltip
                  title={<Typography variant="span">{props.subTitle}</Typography>}
                  placement="top"
                >
                  <Typography variant="caption" className="subtitle">
                    {addEllipsis(checkBlankValue(props.subTitle))}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography variant="caption" className="subtitle">
                  {checkBlankValue(props.subTitle)}
                </Typography>
              )}
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography variant="h5">{props.title}</Typography>
            <Typography variant="caption" className="subtitle">
              {checkBlankValue(props.subTitle)}
            </Typography>
          </React.Fragment>
        )}
      </Box>
    );
  }

  return <React.Fragment />;
};

LabeledValue.defaultProps = {
  isVisible: true,
  variant: 'light'
};

export default LabeledValue;
