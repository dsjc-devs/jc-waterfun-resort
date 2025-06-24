// assets
import {
  DashboardOutlined,
} from '@ant-design/icons';

// icons
const ant_icons = {
  DashboardOutlined,
}

const icons = {
  ...ant_icons,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const modules = [
  {
    id: 'group-dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/portal/dashboard',
        icon: icons.DashboardOutlined,
        breadcrumbs: false,
      }
    ]
  },
]

export default modules;
