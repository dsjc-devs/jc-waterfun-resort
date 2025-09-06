import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"
import FAQS from "./faqs"
import AccommodationType from "./accomodation-type"
import Reservations from "./reservations"

const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations,
  ...FAQS,
  ...AccommodationType,
  ...Reservations
}

export default agent