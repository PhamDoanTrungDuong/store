import { RadioGroup, FormControlLabel, Radio, FormControl } from "@mui/material";
import React from "react";

interface IProps {
      options: any[];
      onChange: (e: any) => void;
      selectedValue: string;
}

const RadioButtonGroup: React.FC<IProps> = ({options, onChange, selectedValue}) => {
  return (
    <div>
      <FormControl>
            <RadioGroup onChange={onChange} value={selectedValue}>
                  {options.map(({ value, label }) => (
                        <FormControlLabel
                              value={value}
                              control={<Radio />}
                              label={label}
                              key={label}
                        />
                  ))}
            </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RadioButtonGroup;
