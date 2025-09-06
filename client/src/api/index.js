import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"
import FAQS from "./faqs"
import AccommodationType from "./accomodation-type"
import Reservations from "./reservations"
import MarketingMaterials from "./marketing-materials"

const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations,
  ...FAQS,
  ...AccommodationType,
  ...Reservations,
  ...MarketingMaterials
}

export default agent