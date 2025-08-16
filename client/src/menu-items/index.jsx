// project import
import getModules from "./modules";

const modules = getModules({ accommodations: [] })

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [...modules]
};

export default menuItems;
