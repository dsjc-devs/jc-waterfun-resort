import { USER_ROLES } from '../constants/constants'

// assets
import {
  DashboardOutlined,
  PlusOutlined,
  BookOutlined,
  CalendarOutlined,
  StarOutlined,
  PictureOutlined,
  UserOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  FileTextOutlined,
  LockOutlined,
  MessageOutlined,
  CaretRightOutlined,
  FormOutlined
} from '@ant-design/icons';

import {
  AccountGroup,
  BedOutline
} from 'mdi-material-ui';

// icon map
export const icons = {
  DashboardIcon: DashboardOutlined,
  AddIcon: PlusOutlined,
  BookIcon: BookOutlined,
  CalendarIcon: CalendarOutlined,
  StarIcon: StarOutlined,
  ImageIcon: PictureOutlined,
  AccountIcon: UserOutlined,
  AccountGroupIcon: AccountGroup,
  RoomIcon: BedOutline,
  InfoCircleOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  FileTextOutlined,
  LockOutlined,
  MessageOutlined,
  CaretRightOutlined,
  FormOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const getModules = ({ accommodations = [] }) => {
  return [
    {
      id: 'group-dashboard',
      title: 'Dashboard',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value, USER_ROLES.CUSTOMER.value],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/portal/dashboard',
          icon: icons.DashboardIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value, USER_ROLES.CUSTOMER.value],
        }
      ]
    },
    {
      id: 'human-resource',
      title: 'Human Resource',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
      children: [
        {
          id: 'staff-list',
          title: 'Staffs',
          type: 'item',
          url: '/portal/staffs',
          icon: icons.AccountGroupIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        },
        {
          id: 'customer-list',
          title: 'Customers',
          type: 'item',
          url: '/portal/customers',
          icon: icons.AccountGroupIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        }
      ]
    },
    {
      id: 'accommodations',
      title: 'Accommodations',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
      children: [
        ...(accommodations?.map((item) => ({
          ...item,
        })) || []),
        {
          id: 'create-accommodation',
          title: 'Accommodation Form',
          type: 'item',
          url: '/portal/accommodations/form',
          icon: icons.FormOutlined,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        },
      ]
    },
    {
      id: 'reservations',
      title: 'Reservations',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
      children: [
        {
          id: 'reservation-list',
          title: 'Reservations',
          type: 'item',
          url: '/portal/reservations',
          icon: icons.BookIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        },
        {
          id: 'calendar',
          title: 'Booking Calendar',
          type: 'item',
          url: '/portal/calendar',
          icon: icons.CalendarIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Materials',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
      children: [
        {
          id: 'banners',
          title: 'Banners',
          type: 'item',
          url: '/portal/banners',
          icon: icons.ImageIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
        },
        {
          id: 'promotions',
          title: 'Promotions',
          type: 'item',
          url: '/portal/promotions',
          icon: icons.StarIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
        }
      ]
    },
    {
      id: 'content-management',
      title: 'Content Management',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
      children: [
        {
          id: 'about-us',
          title: 'About Us',
          type: 'item',
          url: '/portal/content-management/about-us',
          icon: icons.InfoCircleOutlined,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value]
        },
        {
          id: 'company-info',
          title: 'Company Info',
          type: 'item',
          url: '/portal/content-management/company-info',
          icon: icons.HomeOutlined,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value]
        },
        // {
        //   id: 'faqs',
        //   title: 'FAQs',
        //   type: 'item',
        //   url: '/content-management/faqs',
        //   icon: icons.QuestionCircleOutlined,
        //   breadcrumbs: false,
        //   access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
        // },
        // {
        //   id: 'gallery',
        //   title: 'Gallery',
        //   type: 'item',
        //   url: '/content-management/gallery',
        //   icon: icons.ImageIcon,
        //   breadcrumbs: false,
        //   access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
        // },
        // {
        //   id: 'announcements',
        //   title: 'Announcements',
        //   type: 'item',
        //   url: '/content-management/announcements',
        //   icon: icons.BellOutlined,
        //   breadcrumbs: false,
        //   access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
        // },
        // {
        //   id: 'terms-conditions',
        //   title: 'Terms & Conditions',
        //   type: 'item',
        //   url: '/content-management/terms-conditions',
        //   icon: icons.FileTextOutlined,
        //   breadcrumbs: false,
        //   access: [USER_ROLES.MASTER_ADMIN.value],
        // },
        // {
        //   id: 'privacy-policy',
        //   title: 'Privacy Policy',
        //   type: 'item',
        //   url: '/content-management/privacy-policy',
        //   icon: icons.LockOutlined,
        //   breadcrumbs: false,
        //   access: [USER_ROLES.MASTER_ADMIN.value],
        // },
        // {
        //   id: 'testimonials',
        //   title: 'Testimonials',
        //   type: 'item',
        //   url: '/content-management/testimonials',
        //   icon: icons.MessageOutlined,
        //   access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
        // }
      ]
    },

    // customers
    {
      id: 'customer-profile',
      title: 'My Account',
      type: 'group',
      access: [USER_ROLES.CUSTOMER.value],
      children: [
        {
          id: 'my-reservations',
          title: 'My Reservations',
          type: 'item',
          url: '/portal/my-reservations',
          icon: icons.BookIcon,
          breadcrumbs: false,
          access: [USER_ROLES.CUSTOMER.value],
        },
      ]
    }
  ]
}

export default getModules;
