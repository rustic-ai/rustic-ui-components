import ListMaterial, { type ListProps } from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import React, {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { type FieldProps, connectField, filterDOMProps } from 'uniforms';

import ListAddField from './ListAddField';
import ListItemField from './ListItemField';

export type ListFieldProps = FieldProps<
  unknown[],
  ListProps,
  { addIcon?: ReactNode; itemProps?: object }
>;

function List({
  addIcon,
  children = <ListItemField name="$" />,
  itemProps,
  label,
  value,
  ...props
}: ListFieldProps) {
  return (
    <>
      <ListMaterial
        dense
        subheader={
          label ? (
            <ListSubheader disableSticky>{label}</ListSubheader>
          ) : undefined
        }
        {...filterDOMProps(props)}
      >
        {value?.map((item, itemIndex) =>
          Children.map(children, (child, childIndex) =>
            isValidElement<{ name?: string }>(child)
              ? cloneElement(child as ReactElement<any>, {
                  key: `${itemIndex}-${childIndex}`,
                  name: child.props.name?.replace('$', '' + itemIndex),
                  ...itemProps,
                })
              : child,
          ),
        )}
      </ListMaterial>
      <ListAddField icon={addIcon} name="$" />
    </>
  );
}

export default connectField<ListFieldProps>(List);
