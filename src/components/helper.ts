/* eslint-disable no-magic-numbers */

import type { ChatCompletionRequest, Content, Sender } from './types'

export function calculateTimeDiffInSeconds(isoDate: string): number {
  const currentDate = new Date()
  const convertedDate = new Date(isoDate)
  return Math.floor((currentDate.getTime() - convertedDate.getTime()) / 1000)
}

export function formatDateAndTime(isoDateTimeInUtc: string): string {
  const convertedDate = new Date(isoDateTimeInUtc)
  const userLocale = navigator.language
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }

  const currentDate = new Date()
  const isDifferentYear =
    convertedDate.getFullYear() !== currentDate.getFullYear()

  const dateAndTimeConnector = isDifferentYear ? ' at ' : ', '

  if (isDifferentYear) {
    dateOptions.year = 'numeric'
  }

  const formattedDateTime =
    convertedDate.toLocaleDateString(userLocale, dateOptions) +
    dateAndTimeConnector +
    convertedDate.toLocaleTimeString(userLocale, timeOptions)
  return formattedDateTime
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export enum TimeFormat {
  HOUR,
  MONTH_DATE,
}

export function formatTimestamp(
  timestampInMillis: number,
  format: TimeFormat
): string {
  const date = new Date(timestampInMillis)

  let options = {}
  const userLocale = navigator.language

  if (format === TimeFormat.HOUR) {
    // example: 10:20 PM
    options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }
  } else {
    // example: Sep 25
    options = {
      month: 'short',
      day: 'numeric',
    }
  }

  return date.toLocaleString(userLocale, options)
}

export function calculateTimeDiffInDays(
  startTimestampInMillis: number,
  endTimestampInMillis: number
): number {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  const startDate = new Date(startTimestampInMillis)
  const endDate = new Date(endTimestampInMillis)
  const differenceInDays = Math.round(
    Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)
  )

  return differenceInDays
}

export function formatTimestampLabel(
  timestampInMillis: number,
  timeDiffInDays: number
) {
  if (timeDiffInDays <= 1) {
    return formatTimestamp(timestampInMillis, TimeFormat.HOUR)
  } else {
    return formatTimestamp(timestampInMillis, TimeFormat.MONTH_DATE)
  }
}

export function formatDurationTime(durationInSeconds: number): string {
  const hours = Math.floor(durationInSeconds / 3600)
  const minutes = Math.floor((durationInSeconds % 3600) / 60)
  const seconds = Math.floor(durationInSeconds % 60)

  const formattedHours = hours > 0 ? `${hours}:` : ''
  // Prefix with 0 when less than 10 minutes and there's an hour part, or no hour but need to format as MM:SS
  const formattedMinutes =
    hours > 0 ? `${minutes.toString().padStart(2, '0')}` : `${minutes}`
  const formattedSeconds = seconds.toString().padStart(2, '0')

  // Conditionally include the hours in the final string
  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`
}

export function getSizeStyles(
  maybeWidth: number | undefined,
  maybeHeight: number | undefined
): { width?: number; height?: number; className?: string } {
  let stylingAttributes = {}

  if (maybeWidth) {
    stylingAttributes = {
      width: maybeWidth,
    }
  }
  if (maybeHeight) {
    stylingAttributes = {
      ...stylingAttributes,
      height: maybeHeight,
    }
  }
  if (!maybeWidth && !maybeHeight) {
    stylingAttributes = {
      className: 'rustic-fit-container',
    }
  }

  return stylingAttributes
}

export function shortenString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - 3) + '...'
}

export function getDayFromUnixTime(unixTime: number): {
  shortName: string
  fullName: string
} {
  const daysOfWeek: { [short: string]: string } = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tues: 'Tuesday',
    Wed: 'Wednesday',
    Thurs: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  }

  const shortDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

  const unixTimeInMilliseconds = unixTime * 1000
  const date = new Date(unixTimeInMilliseconds)

  const dayOfWeekShort = shortDays[date.getDay()]
  const dayOfWeekFull = daysOfWeek[dayOfWeekShort]

  return { shortName: dayOfWeekShort, fullName: dayOfWeekFull }
}

export function toChatRequest(
  sender: Sender,
  msg?: string,
  files?: { url: string; name?: string }[]
): ChatCompletionRequest {
  const name = sender.id
  const content: Content[] = []
  if (msg && msg?.trim().length) {
    content.push({
      type: 'text',
      text: msg,
    })
  }
  if (files && files.length > 0) {
    for (let i = 0; i < files?.length; i++) {
      content.push({
        type: 'file_url',
        file_url: {
          url: files[i].url,
          name: files[i].name,
        },
      })
    }
  }
  return {
    messages: [{ content: content, role: 'user', name: name }],
  }
}
