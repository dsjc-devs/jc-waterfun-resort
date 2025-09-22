const COMPANY_NAME = import.meta.env.VITE_APP_COMPANY_NAME;

const USER_TYPES = [
  {
    label: "Master Admin",
    value: "MASTER_ADMIN"
  },
  {
    label: "Admin",
    value: "ADMIN"
  },
  {
    label: "Receptionist",
    value: "RECEPTIONIST"
  },
  {
    label: "Customer",
    value: "CUSTOMER"
  },
]

const USER_ROLES = USER_TYPES.reduce((acc, role) => {
  acc[role.value] = role;
  return acc;
}, {});

const USER_STATUSSES = ["ACTIVE", "INACTIVE", "ARCHIVED", "BANNED"]


const BLANK_VALUE = "-"

const NO_CATEGORY = "No Category"

const PESO_SIGN = "₱"

const OPTIONS = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  onSuccess: (data, key, config) => data
};

const CALENDAR_STYLES = {
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  padding: '20px',
  margin: '20px auto',
  maxWidth: '1200px',
  minHeight: '600px',
  border: '1px solid #e2e8f0',
  position: 'relative',
  overflow: 'hidden',
  width: '95%'
};

const CALENDAR_HEADER_STYLES = {
  marginBottom: '32px',
  textAlign: 'center',
  position: 'relative'
};

const CALENDAR_TITLE_STYLES = {
  fontSize: '2.5rem',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #4f8a8b 0%, #2d3748 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '12px',
  letterSpacing: '-0.02em'
};

const CALENDAR_DESC_STYLES = {
  fontSize: '1.1rem',
  color: '#64748b',
  marginBottom: '0',
  fontWeight: 400
};

const CUSTOM_CALENDAR_CSS = `
  .fc {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .fc-toolbar {
    margin-bottom: 16px !important;
    padding: 8px 0 !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
  }
  
  .fc-toolbar-title {
    font-size: 1.4rem !important;
    font-weight: 700 !important;
    color: #1e293b !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  .fc-toolbar-chunk {
    display: flex !important;
    align-items: center !important;
    flex-wrap: wrap !important;
    gap: 4px !important;
  }
  
  .fc-button-group {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 2px !important;
  }
  
  .fc-button {
    background: linear-gradient(135deg, #4f8a8b 0%, #3d6a6c 100%) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 8px !important;
    margin: 0 1px !important;
    padding: 6px 12px !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    box-shadow: 0 2px 8px rgba(79,138,139,0.15) !important;
    transition: all 0.2s ease !important;
    cursor: pointer !important;
    white-space: nowrap !important;
    min-width: auto !important;
  }
  
  .fc-button:hover {
    background: linear-gradient(135deg, #3d6a6c 0%, #2d5155 100%) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(79,138,139,0.25) !important;
  }
  
  .fc-button.fc-button-active, .fc-button:focus {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
    outline: none !important;
    box-shadow: 0 2px 8px rgba(30,41,59,0.3) !important;
  }
  
  /* Fix event visibility */
  .fc-event {
    background-color: #4f8a8b !important;
    border-color: #4f8a8b !important;
    color: #ffffff !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
    font-size: 0.8rem !important;
    font-weight: 600 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    position: relative !important;
    margin: 1px 0 !important;
    min-height: 20px !important;
    line-height: 1.2 !important;
  }
  
  .fc-daygrid-event, .fc-list-event {
    background-color: #4f8a8b !important;
    border-color: #4f8a8b !important;
    color: #ffffff !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
    font-size: 0.8rem !important;
    font-weight: 600 !important;
    border: none !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    position: relative !important;
    margin: 1px 0 !important;
    min-height: 20px !important;
  }
  
  .fc-daygrid-event:hover, .fc-event:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25) !important;
    z-index: 10 !important;
    background-color: #3d6a6c !important;
    border-color: #3d6a6c !important;
  }
  
  .fc-event-title {
    color: #ffffff !important;
    font-weight: 600 !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    white-space: nowrap !important;
  }
  
  .fc-daygrid-event .fc-event-title {
    color: #ffffff !important;
  }
  
  /* Ensure proper event background colors */
  .fc-event[style*="background-color: rgb(79, 138, 139)"] {
    background-color: #4f8a8b !important;
    border-color: #4f8a8b !important;
  }
  
  .fc-event[style*="background-color: rgb(245, 158, 11)"] {
    background-color: #f59e0b !important;
    border-color: #f59e0b !important;
  }
  
  .fc-event[style*="background-color: rgb(239, 68, 68)"] {
    background-color: #ef4444 !important;
    border-color: #ef4444 !important;
  }
  
  .fc-daygrid-event-dot {
    margin-right: 6px !important;
    border-radius: 50% !important;
    background-color: #ffffff !important;
  }
  
  .fc-list-table {
    border-radius: 12px !important;
    overflow: hidden !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
  }
  
  .fc-list-table td {
    font-size: 0.9rem !important;
    padding: 8px 12px !important;
    border-color: #f1f5f9 !important;
  }
  
  .fc-list-event-title {
    font-weight: 600 !important;
  }
  
  .fc-day-today {
    background: rgba(79,138,139,0.08) !important;
  }
  
  .fc-day-header {
    font-weight: 700 !important;
    color: #475569 !important;
    padding: 8px 4px !important;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    font-size: 0.8rem !important;
  }
  
  .fc-scrollgrid {
    border-radius: 12px !important;
    overflow: hidden !important;
    border-color: #e2e8f0 !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
  }
  
  .fc-theme-standard td, .fc-theme-standard th {
    border-color: #f1f5f9 !important;
  }

  .fc-h-event {
    background: none !important;
    border: 1px solid !important;
  }

  .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
    min-height: 2em !important;
  }

  .fc-daygrid-day-frame {
    min-height: 60px !important;
  }

  .fc-daygrid-day-events {
    margin-top: 2px !important;
  }

  /* Custom tooltip styles */
  .custom-tooltip {
    position: fixed;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    color: white;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 1000;
    pointer-events: none;
    max-width: 280px;
    line-height: 1.4;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
  }

  .custom-tooltip::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #1e293b;
  }

  .custom-tooltip .tooltip-title {
    font-weight: 700;
    margin-bottom: 4px;
    color: #ffffff;
  }

  .custom-tooltip .tooltip-date {
    color: #94a3b8;
    font-size: 0.75rem;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .fc-toolbar {
      flex-direction: column !important;
      align-items: center !important;
      gap: 12px !important;
    }
    
    .fc-toolbar-chunk {
      justify-content: center !important;
    }
    
    .fc-toolbar-title {
      font-size: 1.2rem !important;
      text-align: center !important;
      order: -1 !important;
    }
    
    .fc-button {
      font-size: 0.75rem !important;
      padding: 6px 8px !important;
    }
    
    .fc-button-group .fc-button {
      margin: 0 1px !important;
    }
    
    .fc-day-header {
      font-size: 0.7rem !important;
      padding: 6px 2px !important;
    }
    
    .fc-daygrid-event, .fc-event {
      font-size: 0.7rem !important;
      padding: 2px 4px !important;
      min-height: 18px !important;
    }
    
    .fc-daygrid-day-frame {
      min-height: 50px !important;
    }
    
    .custom-tooltip {
      max-width: 200px !important;
      font-size: 0.8rem !important;
      padding: 8px 10px !important;
    }
  }
  
  @media (max-width: 480px) {
    .fc-header-toolbar {
      flex-direction: column !important;
    }
    
    .fc-toolbar-title {
      font-size: 1rem !important;
      margin-bottom: 8px !important;
    }
    
    .fc-button {
      font-size: 0.7rem !important;
      padding: 4px 6px !important;
    }
    
    .fc-day-header {
      font-size: 0.65rem !important;
    }
    
    .fc-daygrid-day-frame {
      min-height: 40px !important;
    }
    
    .fc-daygrid-event, .fc-event {
      font-size: 0.65rem !important;
      padding: 1px 3px !important;
      min-height: 16px !important;
    }
  }

  /* Tablet Styles */
  @media (min-width: 769px) and (max-width: 1024px) {
    .fc-toolbar-title {
      font-size: 1.5rem !important;
    }
    
    .fc-button {
      font-size: 0.9rem !important;
      padding: 7px 14px !important;
    }
    
    .fc-daygrid-event, .fc-event {
      font-size: 0.85rem !important;
      padding: 5px 8px !important;
    }
  }
`;

export {
  COMPANY_NAME,
  USER_TYPES,
  BLANK_VALUE,
  USER_ROLES,
  USER_STATUSSES,
  NO_CATEGORY,
  PESO_SIGN,
  OPTIONS,
  CALENDAR_STYLES,
  CALENDAR_HEADER_STYLES,
  CALENDAR_TITLE_STYLES,
  CALENDAR_DESC_STYLES,
  CUSTOM_CALENDAR_CSS
}