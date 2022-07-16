import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form';

interface IProps extends UseControllerProps {
      label: string;
      items: string[];
  }

const AppSelectList: React.FC<IProps> = (props) => {
      const { fieldState, field } = useController({ ...props, defaultValue: '' });
      return (
          <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel>{props.label}</InputLabel>
              <Select
                  value={field.value}
                  label={props.label}
                  onChange={field.onChange}
              >
                  {props.items.map((item, index) => (
                      <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
              </Select>
              <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
      )
}

export default AppSelectList