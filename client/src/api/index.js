import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"
import FAQS from "./faqs"
import AccommodationType from "./accomodation-type"
import AmenityType from "./amenity-type"
import Reservations from "./reservations"
import MarketingMaterials from "./marketing-materials"
import Payments from "./payments"
import Policies from "./policies"

const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations,
  ...FAQS,
  ...AccommodationType,
  ...AmenityType,
  ...Reservations,
  ...MarketingMaterials,
  ...Payments,
  ...Policies
}

export default agent