import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface IProps extends UseControllerProps {
  label: string;
  disabled: boolean;
}
const AppCheckbox: React.FC<IProps> = (props: IProps) => {
  const { field } = useController({ ...props, defaultValue: false });
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox {...field} checked={field.value} color="secondary" disabled={props.disabled} />
        }
        label={props.label}
      />
    </>
  );
};

export default AppCheckbox;
