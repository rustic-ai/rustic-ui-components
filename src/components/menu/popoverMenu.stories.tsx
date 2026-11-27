import Typography from '@mui/material/Typography'
import type { Meta } from '@storybook/react-webpack5'
import type React from 'react'

import Icon from '../icon/icon'
import PopoverMenu from './popoverMenu'

const meta: Meta<React.ComponentProps<typeof PopoverMenu>> = {
  title: 'Rustic UI/Menu/Popover Menu',
  component: PopoverMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}
export default meta

meta.argTypes = {
  ...meta.argTypes,
  menuItems: {
    table: {
      type: {
        summary: 'An array of PopoverMenuItem.\n',
        detail:
          'Each PopoverMenuItem has the following fields:\n' +
          '  label: Text label displayed for the menu item..\n' +
          '  onClick: An optional function that gets called when the menu item is clicked. It receives an optional MouseEvent object as an argument.\n' +
          '  startDecorator: An optional React node that will be rendered at the beginning of the menu item. This can be used for icons or other decorative elements.\n' +
          '  endDecorator: An optional React node that will be rendered at the end of the menu item. This is typically used for icons or other decorative elements.\n' +
          '  href: An optional URL that, if provided, makes the menu item behave like a link. When the menu item is clicked, the browser will navigate to this URL.\n' +
          '  isFiledownload: An optional boolean that, when true, prompts the browser to download the linked URL as a file.' +
          '  downloadFileName: An optional string that specifies a custom file name for the downloaded file, overriding the original name.',
      },
    },
  },
}

const pinIcon = <Icon name="keep" />
const addCircleIcon = <Icon name="add_circle" />
const deleteIcon = <Icon name="delete" />
const thermostatIcon = <Icon name="device_thermostat" />
const listIcon = <Icon name="list" />

const defaultMenuItems = [
  {
    label: 'Rename',
    onClick: () => {},
    startDecorator: <Icon name="edit" />,
  },
  {
    label: 'Pin Topic',
    onClick: () => {},
    startDecorator: pinIcon,
  },
  {
    label: 'Share',
    onClick: () => {},
    startDecorator: <Icon name="ios_share" />,
  },
  {
    label: 'View Participants',
    onClick: () => {},
    startDecorator: <Icon name="groups" />,
  },
  {
    label: 'Leave Topic',
    onClick: () => {},
    startDecorator: <Icon name="exit_to_app" />,
  },
  {
    label: 'Delete',
    onClick: () => {},
    startDecorator: deleteIcon,
  },
]

const endDecoratorMenuItems = [
  {
    label: 'Charts',
    onClick: () => {},
    endDecorator: pinIcon,
  },
  {
    label: 'Graphs',
    onClick: () => {},
    endDecorator: pinIcon,
  },
  {
    label: 'Marketing',
    onClick: () => {},
    endDecorator: pinIcon,
  },
]

const startAndEndDecoratorMenuItems = [
  {
    label: 'Celsius',
    onClick: () => {},
    startDecorator: thermostatIcon,
    endDecorator: addCircleIcon,
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
    startDecorator: thermostatIcon,
    endDecorator: addCircleIcon,
  },
]

const textDecorator = [
  {
    label: 'Celsius',
    onClick: () => {},
    startDecorator: thermostatIcon,
    endDecorator: <Typography variant="caption">°C</Typography>,
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
    startDecorator: thermostatIcon,
    endDecorator: <Typography variant="caption">°F</Typography>,
  },
]

const noDecoratorsMenuItems = [
  {
    label: 'Celsius',
    onClick: () => {},
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
  },
]

export const Default = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'Open menu',
  },
}

export const EndDecorator = {
  args: {
    menuItems: endDecoratorMenuItems,
    ariaLabel: 'Open menu',
  },
}

export const StartAndEndDecorators = {
  args: {
    menuItems: startAndEndDecoratorMenuItems,
    ariaLabel: 'Open menu',
  },
}

export const TextDecorator = {
  args: {
    menuItems: textDecorator,
    ariaLabel: 'Open menu',
  },
}

export const NoDecorators = {
  args: {
    menuItems: noDecoratorsMenuItems,
    ariaLabel: 'Open menu',
  },
}

export const WithCustomButtonIcon = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'Open menu',
    icon: listIcon,
  },
}

export const WithCustomButtonText = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'Open menu',
    buttonText: 'Menu',
  },
}

export const WithCustomButtonIconAndText = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'Open menu',
    icon: listIcon,
    buttonText: 'Menu',
  },
}

export const WithLink = {
  args: {
    menuItems: [
      {
        label: 'Go To Rustic AI',
        href: 'https://www.rustic.ai',
      },
    ],
    ariaLabel: 'Open menu',
  },
}

export const WithDownloadLink = {
  args: {
    menuItems: [
      {
        label: 'Download Logo',
        href: 'images/rustic-ui-logo.svg',
        isFiledownload: true,
      },
    ],
    ariaLabel: 'Open menu',
  },
}
