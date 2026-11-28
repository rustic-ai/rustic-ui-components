import Button, { type ButtonProps } from '@mui/material/Button';
import FormControl, { type FormControlProps } from '@mui/material/FormControl';
import { cloneDeep } from './utils';
import React, { type ReactNode } from 'react';
import {
  type FieldProps,
  connectField,
  filterDOMProps,
  joinName,
  useField,
} from 'uniforms';

export type ListAddFieldProps = FieldProps<
  unknown,
  ButtonProps,
  {
    fullWidth?: FormControlProps['fullWidth'];
    icon?: ReactNode;
    margin?: FormControlProps['margin'];
    variant?: FormControlProps['variant'];
  }
>;

function ListAdd({
  disabled,
  fullWidth = true,
  icon = '+',
  margin = 'dense',
  name,
  readOnly,
  value,
  variant,
  ...props
}: ListAddFieldProps) {
  const nameParts = joinName(null, name);
  const parentName = joinName(nameParts.slice(0, -1));
  const parent = useField<{ maxCount?: number }, unknown[]>(
    parentName,
    {},
    { absoluteName: true },
  )[0];

  const limitNotReached =
    !disabled && !(parent.maxCount! <= parent.value!.length);

  return (
    <FormControl fullWidth={fullWidth} margin={margin} variant={variant}>
      <Button
        size="large"
        variant="outlined"
        {...filterDOMProps(props)}
        disabled={!limitNotReached}
        onClick={() => {
          if (!readOnly) {
            parent.onChange(parent.value!.concat([cloneDeep(value)]));
          }
        }}
      >
        {icon}
      </Button>
    </FormControl>
  );
}

export default connectField<ListAddFieldProps>(ListAdd, {
  initialValue: false,
  kind: 'leaf',
});
