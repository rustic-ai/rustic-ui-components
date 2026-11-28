import type { Meta } from '@storybook/react-webpack5'
import type React from 'react'

import Weather from './weather'

const meta: Meta<React.ComponentProps<typeof Weather>> = {
  title: 'Rustic UI/Weather/Weather',
  component: Weather,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'clamp(250px, 80vw, 800px)' }}>
        <Story />
      </div>
    ),
  ],
}

meta.argTypes = {
  weather: {
    table: {
      type: {
        summary: 'Weather[]',
        detail:
          "timestamp: A unix timestamp in seconds. \ntemp: An object containing low, high, and current temperatures for a given day. The current temperature is only used on today's weather.\nweatherIcon: An object containing an icon URL and description of the weather.",
      },
    },
  },
  units: {
    table: {
      type: {
        summary: `'metric' | 'imperial'`,
      },
    },
  },
}

export default meta

const weatherData = {
  weather: [
    {
      timestamp: 1705440787,
      temp: {
        low: -0.93,
        high: 1.23,
        current: 0.6,
      },
      weatherIcon: {
        description: 'broken clouds',
        icon: 'https://openweathermap.org/img/wn/04d.png',
      },
    },
    {
      timestamp: 1705521600,
      temp: {
        low: -3.93,
        high: 1.23,
      },
      weatherIcon: {
        description: 'snow',
        icon: 'https://openweathermap.org/img/wn/13d.png',
      },
    },
    {
      timestamp: 1705608000,
      temp: {
        low: -0.93,
        high: 4.23,
      },
      weatherIcon: {
        description: 'light rain',
        icon: 'https://openweathermap.org/img/wn/10d.png',
      },
    },
    {
      timestamp: 1705694400,
      temp: {
        low: 2.93,
        high: 1.23,
      },
      weatherIcon: {
        description: 'broken clouds',
        icon: 'https://openweathermap.org/img/wn/04d.png',
      },
    },
    {
      timestamp: 1705780800,
      temp: {
        low: 1.93,
        high: 10.23,
      },
      weatherIcon: {
        description: 'broken clouds',
        icon: 'https://openweathermap.org/img/wn/04d.png',
      },
    },
    {
      timestamp: 1705867200,
      temp: {
        low: -0.93,
        high: 1.23,
      },
      weatherIcon: {
        description: 'broken clouds',
        icon: 'https://openweathermap.org/img/wn/04d.png',
      },
    },
    {
      timestamp: 1705953600,
      temp: {
        low: -1.93,
        high: 3.23,
      },
      weatherIcon: {
        description: 'light rain',
        icon: 'https://openweathermap.org/img/wn/10d.png',
      },
    },
    {
      timestamp: 1706040000,
      temp: {
        low: 1.93,
        high: 2.23,
      },
      weatherIcon: {
        description: 'broken clouds',
        icon: 'https://openweathermap.org/img/wn/04d.png',
      },
    },
  ],
  location: 'New York',
  units: 'metric',
  weatherProvider: 'Your Weather Provider',
}

export const Default = {
  args: {
    ...weatherData,
  },
}
