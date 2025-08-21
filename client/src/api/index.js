import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"
import FAQS from "./faqs"
import AccommodationType from "./accomodationsType"

const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations,
  ...FAQS,
  ...AccommodationType
}

export default agent