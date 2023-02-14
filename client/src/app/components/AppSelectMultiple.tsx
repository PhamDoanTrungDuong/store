import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Theme,
	SelectChangeEvent,
	useTheme,
	Box,
	Chip,
	OutlinedInput,
} from "@mui/material";
import React from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface IProps extends UseControllerProps {
	label: string;
	items: string[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

const AppSelectMultiple: React.FC<IProps> = (props) => {
	const theme = useTheme();
	const [personName, setPersonName] = React.useState<string[]>([]);
	const { fieldState, field } = useController({ ...props, defaultValue: [] });

	const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        console.log(event.target.value)
		const {
			target: { value },
		} = event;
		setPersonName(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value
		);
        field.onChange(value.toString());
	};
	return (
		<FormControl fullWidth error={!!fieldState.error}>
			<InputLabel>{props.label}</InputLabel>
			<Select
                {...field}
                {...props}
				labelId="demo-multiple-chip-label"
				id="demo-multiple-chip"
				multiple
				value={personName}
				// label={props.label}
				onChange={handleChange} 
				input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
				renderValue={(selected) => (
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
						{selected.map((value: any) => (
							<Chip key={value} label={value} />
						))}
					</Box>
				)}
				MenuProps={MenuProps}>
				{props.items.map((item, index) => (
					<MenuItem
						key={index}
						value={item}
						style={getStyles(item, personName, theme)}>
						{item}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{fieldState.error?.message}</FormHelperText>
		</FormControl>
	);
};

export default AppSelectMultiple;