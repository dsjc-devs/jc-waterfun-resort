import React, { useEffect, useState } from 'react';
import { useField } from 'formik';
import { TextField } from '@mui/material';

const FormikTextInput = (props) => {
  const [field, meta, helper] = useField(props.name || '');
  const errorText = meta.error && meta.touched ? meta.error : '';
  const [value, setValue] = useState(props.value || '');

  const handleOnChange = (event) => {
    const newValue = event.target.value || '';
    setValue(newValue);
    helper.setValue(newValue);
  };

  useEffect(() => {
    const newValue = props?.value || '';
    setValue(newValue);
    helper.setValue(newValue);
  }, [props?.value]);

  const clonedProps = { ...props };
  delete clonedProps.isTextArea;
  delete clonedProps.isDate;
  delete clonedProps.noErrorText;
  delete clonedProps.modifiedInputProps;

  const inputProps = {
    ...props.InputProps,
    ...props.modifiedInputProps,
  };

  return (
    <React.Fragment>
      <TextField
        {...field}
        {...clonedProps}
        value={field.value}
        onChange={handleOnChange}
        helperText={props.noErrorText ? '' : errorText}
        error={!!errorText}
        label={props.label}
        variant={props.variant || 'filled'}
        fullWidth
        className="filled-input"
        multiline={props.isTextArea}
        rows={props.isTextArea ? 4 : 0}
        type={props.isDate ? 'datetime-local' : !props.type ? 'text' : props.type}
        placeholder={props.placeholder}
        InputProps={inputProps}
      />
    </React.Fragment>
  );
};

export default FormikTextInput;
