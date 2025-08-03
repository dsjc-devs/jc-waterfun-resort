import { USER_TYPES } from '../constants/constants'

// assets
import {
  DashboardOutlined,
  PlusOutlined,
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
  PictureOutlined,
  UserOutlined
} from '@ant-design/icons';

import {
  AccountGroup,
  BedOutline
} from 'mdi-material-ui';

// icon map
const icons = {
  DashboardIcon: DashboardOutlined,
  AddIcon: PlusOutlined,
  BookIcon: BookOutlined,
  CalendarIcon: CalendarOutlined,
  StarIcon: StarOutlined,
  ImageIcon: PictureOutlined,
  AccountIcon: UserOutlined,
  AccountGroupIcon: AccountGroup,
  RoomIcon: BedOutline
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const modules = [
  {
    id: 'group-dashboard',
    title: 'Dashboard',
    type: 'group',
    access: [USER_TYPES[0].value, USER_TYPES[1].value, USER_TYPES[2].value],
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/portal/dashboard',
        icon: icons.DashboardIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value, USER_TYPES[1].value, USER_TYPES[2].value],
      }
    ]
  },
  {
    id: 'human-resource',
    title: 'Human Resource',
    type: 'group',
    access: [USER_TYPES[0].value, USER_TYPES[1].value],
    children: [
      {
        id: 'staff-list',
        title: 'Staffs',
        type: 'item',
        url: '/portal/staffs',
        icon: icons.AccountGroupIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value, USER_TYPES[1].value],
      },
      {
        id: 'customer-list',
        title: 'Customers',
        type: 'item',
        url: '/portal/customers',
        icon: icons.AccountGroupIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value, USER_TYPES[1].value],
      }
    ]
  },
  {
    id: 'rooms',
    title: 'Rooms Management',
    type: 'group',
    access: [USER_TYPES[0].value, USER_TYPES[1].value],
    children: [
      {
        id: 'room-list',
        title: 'Rooms List',
        type: 'item',
        url: '/portal/rooms',
        icon: icons.RoomIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value, USER_TYPES[1].value],
      },
    ]
  },
  {
    id: 'reservations',
    title: 'Reservations',
    type: 'group',
    access: [USER_TYPES[0].value, USER_TYPES[1].value],
    children: [
      {
        id: 'reservation-list',
        title: 'Reservation List',
        type: 'item',
        url: '/portal/reservations',
        icon: icons.BookIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value, USER_TYPES[1].value],
      },
      {
        id: 'calendar',
        title: 'Booking Calendar',
        type: 'item',
        url: '/portal/calendar',
        icon: icons.CalendarIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value, USER_TYPES[1].value],
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Materials',
    type: 'group',
    access: [USER_TYPES[0].value],
    children: [
      {
        id: 'banners',
        title: 'Banners',
        type: 'item',
        url: '/portal/banners',
        icon: icons.ImageIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value],
      },
      {
        id: 'promotions',
        title: 'Promotions',
        type: 'item',
        url: '/portal/promotions',
        icon: icons.StarIcon,
        breadcrumbs: false,
        access: [USER_TYPES[0].value],
      }
    ]
  },
  {
    id: 'customer-profile',
    title: 'My Account',
    type: 'group',
    access: [USER_TYPES[2].value],
    children: [
      {
        id: 'my-reservations',
        title: 'My Reservations',
        type: 'item',
        url: '/portal/my-reservations',
        icon: icons.BookIcon,
        breadcrumbs: false,
        access: [USER_TYPES[2].value],
      },
    ]
  }
];

export default modules;
