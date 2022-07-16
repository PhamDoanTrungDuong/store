import { TextField } from '@mui/material';
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

interface IProps extends UseControllerProps{
      label: string;
      multiline?: boolean;
      rows?: number;
      type?: string;
}

const AppTextInput: React.FC<IProps> = (props) => {

const {fieldState, field} = useController({...props, defaultValue: ''});
  return (
    <>
      <TextField
            {...props}
            {...field}
            multiline={props.multiline}
            rows={props.rows}
            type={props.type}
            fullWidth
            variant='standard'
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    </>
  )
}

export default AppTextInput