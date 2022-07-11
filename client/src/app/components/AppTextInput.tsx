import { TextField } from '@mui/material';
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

interface IProps extends UseControllerProps{
      label: string
}

const AppTextInput: React.FC<IProps> = (props: IProps) => {

const {fieldState, field} = useController({...props, defaultValue: ''});
  return (
    <>
      <TextField 
            {...props}
            {...field}
            fullWidth
            variant='standard'
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
      />
    </>
  )
}

export default AppTextInput