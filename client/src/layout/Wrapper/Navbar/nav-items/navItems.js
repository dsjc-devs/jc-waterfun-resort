import { NO_CATEGORY } from "constants/constants"
import textFormatter from "utils/textFormatter"

const navItems = [
  { _id: "home", name: "Home", link: '/' },
  { _id: "book-now", name: "Book Now", link: '/book-now' },
  { _id: "about-us", name: "About Us", link: '/about-us' },
  { _id: "contact-us", name: "Contact Us", link: '/contact-us' },
]

const getDropdownNavItems = ({ accomodationTypes = [], amenityTypes = [] }) => [
  {
    title: "Accommodations",
    subtitle: "Our Spaces",
    link: "/accommodations",
    sublinks: Array.isArray(accomodationTypes)
      ? accomodationTypes
        .filter((f) => f.title !== NO_CATEGORY)
        .map((f) => ({
          title: f.title,
          link: `/accommodations?type=${textFormatter.toSlug(f.title)}`
        }))
      : [],
  },
  {
    title: "Amenities",
    subtitle: "Facilities",
    link: "/amenities",
    sublinks: Array.isArray(amenityTypes)
      ? amenityTypes
        .filter((f) => f.name !== NO_CATEGORY)
        .map((f) => ({
          title: f.name,
          link: `/amenities?type=${textFormatter.toSlug(f.name)}`
        }))
      : [],
  },
  {
    title: "Media Center",
    subtitle: "Photos & Articles",
    sublinks: [
      { title: "Resort Gallery", link: "/gallery" },
      { title: "Articles", link: "/articles" },
      { title: "Testimonials", link: "/testimonials" },

    ]
  },
  {
    title: "Rates",
    link: "/resort-rates",
    subtitle: "Pricing",
    sublinks: [
      { title: "Day Tour", link: "/resort-rates?type=day" },
      { title: "Night Tour", link: "/resort-rates?type=night" },
    ]
  }
]

export default navItems
export { getDropdownNavItems }
