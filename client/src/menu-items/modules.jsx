// assets
import {
  DashboardOutlined,
} from '@ant-design/icons';

import {
  AccountGroup
} from 'mdi-material-ui'

// icons
const ant_icons = {
  DashboardOutlined,
}

const mdi_icons = {
  AccountGroup
}

const icons = {
  ...ant_icons,
  ...mdi_icons
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const modules = [
  {
    id: 'group-dashboard',
    title: 'Dashboard',
    type: 'group',
    access: ["POSITIONS.POSITIONS_STAFF", "POSITIONS.POSITIONS_MASTER_ADMIN"],
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/portal/dashboard',
        icon: icons.DashboardOutlined,
        breadcrumbs: false,
        access: ["POSITIONS.POSITIONS_STAFF", "POSITIONS.POSITIONS_MASTER_ADMIN"],

      }
    ]
  },
  {
    id: 'human-resource',
    title: 'Human Resource',
    type: 'group',
    access: ["POSITIONS.POSITIONS_STAFF", "POSITIONS.POSITIONS_MASTER_ADMIN"],
    children: [
      {
        id: 'human-resource-list',
        title: 'Staffs',
        type: 'item',
        url: '/portal/staffs',
        icon: icons.AccountGroup,
        breadcrumbs: false,
        access: ["POSITIONS.POSITIONS_STAFF", "POSITIONS.POSITIONS_MASTER_ADMIN"],
      },
    ]
  },
]

export default modules;
