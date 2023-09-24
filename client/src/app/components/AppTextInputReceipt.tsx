import { TextField } from '@mui/material';
import {
  UseControllerProps,
  useController,
  FieldValues,
} from 'react-hook-form';

interface IProps extends UseControllerProps {
  label: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
}

const AppTextInputReceipt: React.FC<IProps> = (props) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController(props);

  return (
    <>
      <TextField
        {...props}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        multiline={props.multiline}
        rows={props.rows}
        type={props.type}
        fullWidth
        error={!!error}
        helperText={error?.message}
      />
    </>
  );
};

export default AppTextInputReceipt;
