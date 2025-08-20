import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"
import FAQS from "./faqs"

const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations,
  ...FAQS
}

export default agent