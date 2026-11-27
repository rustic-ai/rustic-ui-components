import './fCCalendar.css'

import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import MarkedMarkdown from '../markdown/markedMarkdown'
import type { CalendarData, CalendarEvent } from '../types'

/** Convert CalendarEvent type to FullCalendar's Event type
 * https://fullcalendar.io/docs/event-object */
function transformEvent(event: CalendarEvent) {
  return {
    title: event.title ? event.title : '',
    start: event.start,
    end: event.end,
    allDay: event.isAllDay,
  }
}

/** The `FCCalendar` component integrates the [FullCalendar](https://fullcalendar.io/docs) library to provide a versatile and interactive calendar view for managing events. It allows users to view events across different time frames and provides features for navigation.
 *
 * FullCalendar libraries are not bundled, so please install the following packages using npm:
 *
 * ```typescript
 * npm i @fullcalendar/core @fullcalendar/daygrid @fullcalendar/react @fullcalendar/timegrid
 * ```
 *
 * **Note**: On mobile screens, the calendar will default to the day view, offering users a detailed perspective of events for the selected day. Conversely, on larger screens, such as desktops or tablets, the calendar will default to the month view, offering users an overview of events scheduled throughout the month. */
export default function FCCalendar(props: CalendarData) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  function getDefaultInitialView() {
    if (isDesktop) {
      return 'dayGridMonth'
    } else {
      return 'timeGridDay'
    }
  }

  return (
    <Box
      className="rustic-fc-calendar"
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        '.fc .fc-toolbar-title': {
          ...theme.typography.h6,
        },
        '.fc .fc-scrollgrid-liquid': {
          borderRadius: `${theme.shape.borderRadius}px`,
        },
        '.fc td': {
          borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
        },
        '.fc .fc-scrollgrid-section-header > th': {
          borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
        },
        '.fc .fc-button, .fc .fc-button:active': {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${theme.shape.borderRadius}px`,
          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            border: `1px solid ${theme.palette.divider}`,
          },
        },
        '.fc .fc-button-group .fc-button.fc-button-active': {
          backgroundColor: theme.palette.secondary.main,
          border: `1px solid ${theme.palette.divider}`,
        },
        '.fc a, .fc .fc-event-title, .fc .fc-button, .fc .fc-timegrid-slot': {
          ...theme.typography.caption,
        },
      }}
    >
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView={getDefaultInitialView()}
        headerToolbar={{
          left: 'title',
          right: 'prev,next dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventColor={theme.palette.secondary.main}
        displayEventTime={false}
        titleFormat={{ year: 'numeric', month: 'long' }}
        views={{
          dayGridMonth: {
            dayHeaderFormat: { weekday: isDesktop ? 'long' : 'narrow' },
          },
          timeGridWeek: {
            dayHeaderFormat: {
              weekday: 'short',
              day: 'numeric',
            },
          },
          timeGridDay: { dayHeaderFormat: { weekday: 'long', day: 'numeric' } },
        }}
        allDaySlot={false}
        initialDate={props.events[0].start}
        events={props.events.map(transformEvent)}
      />
    </Box>
  )
}
