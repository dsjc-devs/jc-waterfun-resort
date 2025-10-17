import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"
import Amenities from "./amenities"
import FAQS from "./faqs"
import AccommodationType from "./accomodation-type"
import AmenityType from "./amenity-type"
import Reservations from "./reservations"
import MarketingMaterials from "./marketing-materials"
import Payments from "./payments"
import Policies from "./policies"
import ResortRates from "./resort-rates"
import ContactUs from "./contact"


const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations,
  ...Amenities,
  ...FAQS,
  ...AccommodationType,
  ...AmenityType,
  ...Reservations,
  ...MarketingMaterials,
  ...Payments,
  ...Policies,
  ...ResortRates,
  ...ContactUs
}

export default agent