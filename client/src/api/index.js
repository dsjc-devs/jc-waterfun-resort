import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"
import FAQS from "./faqs"
import AccommodationType from "./accomodation-type"
import Reservations from "./reservations"
import MarketingMaterials from "./marketing-materials"
import Payments from "./payments"

const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations,
  ...FAQS,
  ...AccommodationType,
  ...Reservations,
  ...MarketingMaterials,
  ...Payments
}

export default agent