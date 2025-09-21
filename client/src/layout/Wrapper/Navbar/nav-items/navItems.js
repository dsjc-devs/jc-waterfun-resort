import { NO_CATEGORY } from "constants/constants"
import textFormatter from "utils/textFormatter"

const navItems = [
  { _id: "home", name: "Home", link: '/' },
  { _id: "book-now", name: "Book Now", link: '/book-now' },
  { _id: "about-us", name: "About Us", link: '/about-us' },
  { _id: "contact-us", name: "Contact Us", link: '/contact-us' },
]

const getDropdownNavItems = (accomodationTypes = []) => [
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
    sublinks: [
      { title: "Swimming Pool", link: "/amenities?type=swimming-pool" },
      { title: "Billiards", link: "/amenities?type=billiards" },
      { title: "Karaoke", link: "/amenities?type=karaoke" }
    ]
  },
  {
    title: "Media Center",
    subtitle: "Photos & Articles",
    link: "/gallery",
    sublinks: [
      { title: "Resort Gallery", link: "/gallery" },
      { title: "Articles", link: "/articles" },
    ]
  },
  {
    title: "Rates",
    subtitle: "Pricing",
    link: "/rates",
    sublinks: [
      { title: "Day Tour", link: "/resort-rates?type=day" },
      { title: "Night Tour", link: "/resort-rates?type=night" },
    ]
  }
]

export default navItems
export { getDropdownNavItems }
