import { PESO_SIGN, USER_ROLES } from '../constants/constants'

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
  FormOutlined,
  HomeFilled,
} from '@ant-design/icons';

import {
  AccountGroup,
  BedOutline,
  HomeGroup,
  ChevronDown,
  ChevronUp,
  TableFurniture as TableIcon,
  OfficeBuilding as EventHallIcon,
  HomeGroup as CottageIcon,
  Pool
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
  FormOutlined,
  HomeFilled,
  HomeGroup,
  ChevronDown,
  ChevronUp,
  TableIcon,
  EventHallIcon,
  CottageIcon,
  Pool,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const getModules = ({ accommodations = [], amenities = [] }) => {
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
      id: "offers",
      title: "Facilities",
      children: [
        {
          id: "accommodations",
          type: "collapse",
          title: "Accommodations",
          icon: icons.HomeGroup,
          children: [
            ...(accommodations?.map((item) => ({
              ...item,
            })) || []),
          ]
        },
        {
          id: "amenities",
          type: "collapse",
          title: "Amenities",
          icon: icons.Pool,
          children: [
            ...(amenities?.map((item) => ({
              ...item,
            })) || []),
          ]
        },
      ]
    },
    {
      id: 'reservations',
      title: 'Reservations',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value, USER_ROLES.CUSTOMER.value],
      children: [
        {
          id: 'reservation-list',
          title: 'Reservations',
          type: 'item',
          url: '/portal/reservations',
          icon: icons.BookIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value, USER_ROLES.CUSTOMER.value],
        },
        {
          id: 'testimonial',
          title: 'Add Testimonial',
          type: 'item',
          url: '/portal/testimonial',
          icon: icons.StarIcon,
          breadcrumbs: false,
          access: [USER_ROLES.CUSTOMER.value],
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
      id: 'content-management',
      title: 'Content Management',
      type: 'group',
      access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
      children: [
        {
          id: 'resort-rates',
          title: 'Rates',
          type: 'item',
          url: '/portal/content-management/rates',
          icon: PESO_SIGN,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        },
        {
          id: 'testimonials-admin',
          title: 'Testimonials',
          type: 'item',
          url: '/portal/content-management/testimonials',
          icon: icons.StarIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
        },
        {
          id: 'accommodation-type',
          title: 'Accommodation Types',
          type: 'item',
          url: '/portal/content-management/accommodation-type',
          icon: icons.FormOutlined,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        },
        {
          id: 'amenity-type',
          title: 'Amenity Types',
          type: 'item',
          url: '/portal/content-management/amenity-type',
          icon: icons.FormOutlined,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
        },
        {
          id: 'media-center',
          title: 'Media Center',
          type: 'collapse',
          icon: icons.StarIcon,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
          children: [
            {
              id: 'marketing-materials',
              title: 'Articles',
              type: 'item',
              url: '/portal/content-management/articles',
              icon: icons.FileTextOutlined,
              breadcrumbs: false,
              access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
            },
            {
              id: 'gallery',
              title: 'Gallery',
              type: 'item',
              url: '/portal/content-management/gallery',
              icon: icons.ImageIcon,
              breadcrumbs: false,
              access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value, USER_ROLES.RECEPTIONIST.value],
            },
          ]
        },
        {
          id: 'resort-details',
          title: 'Resort Details',
          type: 'collapse',
          icon: icons.InfoCircleOutlined,
          breadcrumbs: false,
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
            {
              id: 'faqs',
              title: 'FAQs',
              type: 'item',
              url: '/portal/content-management/faqs',
              icon: icons.QuestionCircleOutlined,
              breadcrumbs: false,
              access: [USER_ROLES.MASTER_ADMIN.value, USER_ROLES.ADMIN.value],
            },
          ]
        },
        {
          id: 'policies',
          title: 'Policies',
          type: 'item',
          url: '/portal/content-management/policies',
          icon: icons.FileTextOutlined,
          breadcrumbs: false,
          access: [USER_ROLES.MASTER_ADMIN.value],
        },
      ]
    },
  ]
}

export default getModules;
