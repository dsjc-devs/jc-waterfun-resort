import Users from "./users"
import ResortDetails from "./resort-details"
import Accommodations from "./accommodations"

const agent = {
  ...Users,
  ...ResortDetails,
  ...Accommodations
}

export default agent