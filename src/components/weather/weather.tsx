import './weather.css'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import { getDayFromUnixTime } from '../helper'
import Icon from '../icon/icon'
import MarkedMarkdown from '../markdown/markedMarkdown'
import PopoverMenu from '../menu/popoverMenu'
import type { WeatherProps } from '../types'

/** The `Weather` component provides a detailed daily weather forecast for a given location, displaying the current temperature, weather description, today's date with high and low temperatures, and a card for each day's forecast showing the day of the week, weather icon, and high and low temperatures, all while attributing the weather data provider. Hourly breakdowns are not currently supported.

Note: The first item in the `Weather` array is presumed to be the current day's weather.
 */
export default function Weather(props: WeatherProps) {
  const [units, setUnits] = useState(props.units)

  function getTempSymbol(units: string) {
    switch (units) {
      case 'imperial':
        return 'F'
      case 'metric':
        return 'C'
    }
  }

  function formatTemperature(temp: number) {
    if (props.units === 'metric' && units === 'imperial') {
      // celsius to fahrenheit -> °F = °C * (9/5) + 32
      // eslint-disable-next-line no-magic-numbers
      return Math.round(temp * (9 / 5) + 32)
    }
    if (props.units === 'imperial' && units === 'metric') {
      // fahrenheit to celsius -> °C = °F * (5/9) - 32
      // eslint-disable-next-line no-magic-numbers
      return Math.round(temp * (5 / 9) - 32)
    }

    return Math.round(temp)
  }

  const millisecondsConversion = 1000
  const dateStringFromTimestamp = new Date(
    props.weather[0].timestamp * millisecondsConversion
  )
  const day = getDayFromUnixTime(props.weather[0].timestamp).shortName
  const date = dateStringFromTimestamp.getDate()
  const lastTwoDigits = 2
  const year = dateStringFromTimestamp
    .getFullYear()
    .toString()
    .slice(lastTwoDigits)

  const formattedDateToday = `${day} ${date}/${year} TODAY`
  const formattedWeatherToday = `HIGH: ${formatTemperature(props.weather[0].temp.high)} / LOW: ${formatTemperature(props.weather[0].temp.high)}`

  const dailyWeatherCards = props.weather.map((weatherPreview, i) => {
    if (i !== 0) {
      return (
        <Card
          variant="outlined"
          key={i}
          className="rustic-daily-weather-card"
          data-cy="daily-weather-card"
        >
          <Typography
            variant="h5"
            component="span"
            color="text.secondary"
            aria-label={getDayFromUnixTime(weatherPreview.timestamp).fullName}
          >
            {getDayFromUnixTime(weatherPreview.timestamp).shortName}
          </Typography>
          <img
            src={weatherPreview.weatherIcon.icon}
            alt={weatherPreview.weatherIcon.description}
          />
          <Typography variant="body2" color="text.secondary">
            High: {formatTemperature(weatherPreview.temp.high)}°
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Low: {formatTemperature(weatherPreview.temp.low)}°
          </Typography>
        </Card>
      )
    }
  })

  return (
    <Card variant="outlined" className="rustic-weather">
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <PopoverMenu
        ariaLabel="Temperature units"
        menuItems={[
          {
            label: 'Celsius',
            endDecorator: '°C',
            onClick: () => setUnits('metric'),
          },
          {
            label: 'Fahrenheit',
            endDecorator: '°F',
            onClick: () => setUnits('imperial'),
          },
        ]}
      />
      <Stack sx={{ alignItems: 'center' }}>
        <Typography variant="h4" component="span" data-cy="location">
          {props.location}
        </Typography>
        <Stack
          direction="row"
          sx={{ alignItems: 'center' }}
          spacing={1}
          className="rustic-current-weather-description"
          data-cy="current-weather-description"
        >
          <img src={props.weather[0].weatherIcon.icon} alt="" />
          <Typography variant="body2">
            {props.weather[0].weatherIcon.description}
          </Typography>
        </Stack>
        {props.weather[0].temp.current && (
          <Typography
            variant="h1"
            component="span"
            data-cy="current-temp"
            className="rustic-current-temp"
          >
            {formatTemperature(props.weather[0].temp.current)}°
            {getTempSymbol(units)}
          </Typography>
        )}
        <Stack direction="row" spacing={2}>
          <Typography variant="overline">{formattedDateToday}</Typography>
          <Typography variant="overline">{formattedWeatherToday}</Typography>
        </Stack>
      </Stack>

      <Box className="rustic-daily-weather-container">{dailyWeatherCards}</Box>

      {props.weatherProvider && (
        <Stack
          sx={{ alignItems: 'center', alignSelf: 'center' }}
          direction="row"
          spacing={1}
          className="rustic-weather-attribution"
        >
          <Icon name="cloud" />
          <Typography variant="body2">
            {`Weather data provided by ${props.weatherProvider}`}
          </Typography>
        </Stack>
      )}
    </Card>
  )
}
