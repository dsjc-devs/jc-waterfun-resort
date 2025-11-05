const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    crimson: '\x1b[38m' // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    gray: '\x1b[100m',
    crimson: '\x1b[48m'
  }
};

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

const RESORT_DETAILS = {
  aboutUs: {
    mission: "Our mission is to provide families and guests with memorable experiences by combining quality facilities with a smooth and reliable reservation process. We strive to create a welcoming environment where every visitor feels valued and cared for.",
    vision: "Our vision is to become a trusted destination for fun, relaxation, and convenience, supported by modern digital solutions that make planning and booking effortless. We aim to be recognized as a resort that grows with the needs of our guests.",
    goals: "Our goal is to make every visit enjoyable by ensuring efficient booking, excellent customer service, and continuous improvement of our amenities. We are dedicated to offering a resort experience that leaves lasting impressions on every guest."
  },
  companyInfo: {
    logo: "/images/jc-waterfun-logo.png",
    name: "John Cezar Waterfun Resort",
    emailAddress: "johncezar.waterfun@gmail.com",
    phoneNumber: "09171224128",
    address: {
      streetAddress: "Rotonda Phase 3 Valle Verde Brgy Langkaan 2",
      city: "Dasmarinas",
      province: "Cavite",
      country: "Philippines"
    }
  },
  companyHashtag: "#WatermazingExperience",
  socials: [
    {
      title: "Facebook",
      link: "https://www.facebook.com/johncezarwaterfunresort/"
    }
  ]
}

const NO_CATEGORY = "No Category"

const PROD_URL = `https://www.john-cezar-waterfun-resort.com`

export {
  colours,
  USER_TYPES,
  USER_STATUSSES,
  USER_ROLES,
  RESORT_DETAILS,
  NO_CATEGORY,
  PROD_URL
}