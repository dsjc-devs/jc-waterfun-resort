// ==============================|| DEFAULT THEME - TYPOGRAPHY ||============================== //

export default function Typography() {
  return {
    htmlFontSize: 16,
    fontFamily: `'inter', sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
      fontFamily: `'inter', serif`,
      fontWeight: 900,
      fontSize: '2.375rem',
      lineHeight: 1.21,
    },
    h2: {
      fontFamily: `'inter', serif`,
      fontWeight: 800,
      fontSize: '1.875rem',
      lineHeight: 1.27,
    },
    h3: {
      fontFamily: `'inter', serif`,
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.33,
    },
    h4: {
      fontFamily: `'inter', serif`,
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: `'inter', serif`,
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.57,
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.66,
    },
    overline: {
      lineHeight: 1.66,
    },
    button: {
      textTransform: 'capitalize',
    },
  };
}
