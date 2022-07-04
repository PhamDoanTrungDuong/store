import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import React, { useState } from "react";

interface IProps {
  options: string[];
  onChange: (items: string[]) => void;
  checked?: string[];
}

const CheckboxButton: React.FC<IProps> = ({ options, onChange, checked }) => {
  const [checkedItems, setCheckedItems] = useState(checked || []);

  const handleChecked = (value: string) => {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newChecked: string[] = [];
    if (currentIndex === -1) 
      newChecked = [...checkedItems, value];
    else
      newChecked = checkedItems.filter((item) => item !== value);
    setCheckedItems(newChecked);
    onChange(newChecked);
  };

  return (
    <div>
      <FormGroup>
        {options.map((item) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.indexOf(item) !== -1}
                onClick={() => handleChecked(item)}
              />
            }
            label={item}
            key={item}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default CheckboxButton;
