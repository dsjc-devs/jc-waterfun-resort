import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {
  CALENDAR_STYLES,
  CALENDAR_HEADER_STYLES,
  CALENDAR_TITLE_STYLES,
  CALENDAR_DESC_STYLES,
  CUSTOM_CALENDAR_CSS
} from 'constants/constants';
import ConvertDate from 'components/ConvertDate';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useGetBlockedDates } from 'api/blocked-dates';

const getResponsiveStyles = () => {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

  return {
    ...CALENDAR_STYLES,
    padding: isMobile ? '15px' : isTablet ? '25px' : CALENDAR_STYLES.padding,
    margin: isMobile ? '10px auto' : '20px auto',
    minHeight: isMobile ? '500px' : isTablet ? '650px' : CALENDAR_STYLES.minHeight,
    width: isMobile ? '98%' : CALENDAR_STYLES.width
  };
};

const getResponsiveHeaderStyles = () => {
  const isMobile = window.innerWidth <= 768;

  return {
    ...CALENDAR_HEADER_STYLES,
    marginBottom: isMobile ? '20px' : CALENDAR_HEADER_STYLES.marginBottom
  };
};

const getResponsiveTitleStyles = () => {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

  return {
    ...CALENDAR_TITLE_STYLES,
    fontSize: isMobile ? '1.8rem' : isTablet ? '2.2rem' : CALENDAR_TITLE_STYLES.fontSize
  };
};

const getResponsiveDescStyles = () => {
  const isMobile = window.innerWidth <= 768;

  return {
    ...CALENDAR_DESC_STYLES,
    fontSize: isMobile ? '0.95rem' : CALENDAR_DESC_STYLES.fontSize
  };
};

const Calendar = ({ events = [], title = '', subtitle = '' }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const theme = useTheme();
  const { data: blockedDates = [] } = useGetBlockedDates();

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEventClick = (info) => {
    const event = info.event;
    // Ignore navigation for blocked events
    if (event.extendedProps?.type === 'blocked') return;
    const startDate = event.start?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const endDate = event.end?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (event.extendedProps?.reservationId) {
      window.open(`/portal/reservations/details/${event.extendedProps?.reservationId}`, '_blank');
    }
  };

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    console.log('Date clicked:', clickedDate);
  };

  const handleEventMouseEnter = (info) => {
    const event = info.event;
    const rect = info.el.getBoundingClientRect();

    console.log('Event mouse enter:', event);

    const tooltipContent = (
      <div>
        <div className="tooltip-title">{event.title}</div>
        <div className="tooltip-date">
          <ConvertDate dateString={event.extendedProps?.startDate} time={true} /> - <ConvertDate dateString={event.extendedProps?.endDate} time={true} />
        </div>
        {event.extendedProps?.reason && (
          <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#fde68a' }}>
            Reason: {event.extendedProps.reason}
          </div>
        )}
        {event.extendedProps?.userData && (
          <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#cbd5e1' }}>
            Guest: {event.extendedProps.userData.firstName} {event.extendedProps.userData.lastName}
          </div>
        )}
      </div>
    );

    const isMobile = window.innerWidth <= 768;
    const x = isMobile ? Math.min(rect.left + rect.width / 2, window.innerWidth - 150) : rect.left + rect.width / 2;
    const y = isMobile ? Math.max(rect.top - 10, 60) : rect.top - 10;

    setTooltip({
      show: true,
      content: tooltipContent,
      x,
      y
    });
  };

  const handleEventMouseLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  // Build reservation events
  const reservationEvents = (events.length > 0 ? events.map((event, index) => {
    if (event.userData) {
      return {
        id: `reservation-${index}`,
        title: `${event.userData.firstName} ${event.userData.lastName} - ${event?.accommodationData?.name}`,
        start: event.startDate,
        end: event.endDate,
        backgroundColor: '#4f8a8b',
        borderColor: '#4f8a8b',
        textColor: '#ffffff',
        extendedProps: {
          type: 'reservation',
          userData: event.userData,
          startDate: event.startDate,
          endDate: event.endDate,
          reservationId: event.reservationId
        }
      };
    }
    return {
      id: `event-${index}`,
      backgroundColor: event.color || '#4f8a8b',
      borderColor: event.color || '#4f8a8b',
      textColor: '#ffffff',
      ...event
    };
  }) : []);

  // Build non-reservation blocked dates as warning-colored events
  const blockedEvents = (blockedDates || [])
    .filter((bd) => bd && bd.isFromReservation === false)
    .map((bd, i) => ({
      id: `blocked-${i}`,
      title: 'Blocked',
      start: bd.startDate,
      end: bd.endDate,
      backgroundColor: theme.palette.warning.main,
      borderColor: theme.palette.warning.main,
      textColor: '#ffffff',
      extendedProps: {
        type: 'blocked',
        startDate: bd.startDate,
        endDate: bd.endDate,
        reason: bd.reason,
        accommodationId: bd.accommodationId,
      }
    }));

  const processedEvents = [...reservationEvents, ...blockedEvents];


  const getHeaderToolbar = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      return {
        left: 'prev,next',
        center: 'title',
        right: 'today'
      };
    }

    return {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    };
  };

  const getViews = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      return {
        listWeek: { buttonText: 'List' },
        dayGridMonth: { buttonText: 'Month' }
      };
    }

    return {
      listWeek: { buttonText: '📋 Week List' },
      dayGridMonth: { buttonText: '📅 Month' },
      timeGridWeek: { buttonText: '📊 Week' },
      timeGridDay: { buttonText: '📋 Day' }
    };
  };

  return (
    <Box sx={getResponsiveStyles()}>
      <style>{CUSTOM_CALENDAR_CSS}</style>
      {/* Ensure blocked events use warning color strongly */}
      <style>{`
        .fc .blocked-event,
        .fc .blocked-event .fc-event-main,
        .fc .blocked-event .fc-event-main-frame {
          background-color: ${theme.palette.warning.main} !important;
          border-color: ${theme.palette.warning.main} !important;
          color: #111827 !important;
        }
      `}</style>
      <Box sx={getResponsiveHeaderStyles()}>
        <Typography
          variant="h2"
          sx={{
            ...getResponsiveTitleStyles(),
            fontFamily: 'inherit',
            mb: 1,
            background: CALENDAR_TITLE_STYLES.background,
            WebkitBackgroundClip: CALENDAR_TITLE_STYLES.WebkitBackgroundClip,
            WebkitTextFillColor: CALENDAR_TITLE_STYLES.WebkitTextFillColor,
            letterSpacing: CALENDAR_TITLE_STYLES.letterSpacing,
            fontWeight: CALENDAR_TITLE_STYLES.fontWeight
          }}
        >
          🏖️ {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            ...getResponsiveDescStyles(),
            color: CALENDAR_DESC_STYLES.color,
            fontWeight: CALENDAR_DESC_STYLES.fontWeight,
            mb: 0
          }}
        >
          📋 {subtitle}
        </Typography>
      </Box>

      {tooltip.show && (
        <Box
          className="custom-tooltip"
          sx={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 1000
          }}
        >
          {tooltip.content}
        </Box>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={windowWidth <= 768 ? "listWeek" : "dayGridMonth"}
        headerToolbar={getHeaderToolbar()}
        views={getViews()}
        events={processedEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        height="auto"
        aspectRatio={windowWidth <= 768 ? 1.2 : windowWidth <= 1024 ? 1.5 : 1.8}
        eventDisplay="block"
        dayMaxEvents={windowWidth <= 768 ? 2 : 3}
        moreLinkClick="popover"
        selectMirror={true}
        weekends={true}
        editable={false}
        selectable={true}
        nowIndicator={true}
        eventDidMount={(info) => {
          info.el.setAttribute('data-event-type', info.event.extendedProps?.type || 'default');
          const isBlocked = info.event.extendedProps?.type === 'blocked';
          const bg = isBlocked ? theme.palette.warning.main : (info.event.backgroundColor || '#4f8a8b');
          const border = isBlocked ? theme.palette.warning.main : (info.event.borderColor || '#4f8a8b');
          const text = isBlocked ? '#111827' : (info.event.textColor || '#ffffff');
          // Force override styles in case calendar CSS is more specific
          info.el.style.setProperty('background-color', bg, 'important');
          info.el.style.setProperty('border-color', border, 'important');
          info.el.style.setProperty('color', text, 'important');
          if (isBlocked) info.el.classList.add('blocked-event');
        }}
        loading={(isLoading) => {
          console.log('Calendar loading:', isLoading);
        }}
      />
    </Box>
  );
};

export default Calendar;