import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/classic/theme.css'
import '@fullcalendar/react/themes/classic/palette.css'
import './fCCalendar.css'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import classicTheme from '@fullcalendar/react/themes/classic'
import timeGridPlugin from '@fullcalendar/react/timegrid'
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
 * npm i @fullcalendar/react temporal-polyfill
 * ```
 *
 * The calendar imports FullCalendar's stylesheets, so your bundler must handle CSS imports from `node_modules`.
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
        fontFamily: theme.typography.fontFamily,
        // FullCalendar 7's classic theme is styled through these variables.
        '--fc-classic-background': theme.palette.background.paper,
        '--fc-classic-foreground': theme.palette.text.primary,
        '--fc-classic-muted-foreground': theme.palette.text.secondary,
        '--fc-classic-border': theme.palette.divider,
        '--fc-classic-strong-border': theme.palette.divider,
        '--fc-classic-primary': theme.palette.secondary.main,
        '--fc-classic-primary-foreground': theme.palette.secondary.contrastText,
        '--fc-classic-button': theme.palette.background.paper,
        '--fc-classic-button-border': theme.palette.divider,
        '--fc-classic-button-foreground': theme.palette.primary.main,
        '--fc-classic-button-strong': theme.palette.secondary.main,
        '--fc-classic-button-strong-border': theme.palette.divider,
        '--fc-classic-button-outline': theme.palette.divider,
        '.rustic-fc-toolbar-title': {
          ...theme.typography.h6,
        },
        '.rustic-fc-button, .rustic-fc-event-title': {
          ...theme.typography.caption,
        },
      }}
    >
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <FullCalendar
        plugins={[classicTheme, timeGridPlugin, dayGridPlugin]}
        // FullCalendar 7 renders hashed theme classes; these give the styles
        // in fCCalendar.css and the tests stable hooks.
        toolbarClass="rustic-fc-toolbar"
        toolbarSectionClass="rustic-fc-toolbar-section"
        toolbarTitleClass="rustic-fc-toolbar-title"
        buttonClass="rustic-fc-button"
        eventTitleClass="rustic-fc-event-title"
        initialView={getDefaultInitialView()}
        headerToolbar={{
          start: 'title',
          end: 'prev,next dayGridMonth,timeGridWeek,timeGridDay',
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
