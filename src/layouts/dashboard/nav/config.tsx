// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  menuItem: icon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Thông tin diễn đàn',
    items: [
      {
        title: 'Form nhập liệu',
        path: '#/dashboard/menu_level',
        icon: ICONS.menuItem,
        children: [
          {
            title: 'Diễn đàn',
            path: '#/dashboard/menu_level/menu_level_2a',
          },
          {
            title: 'Sự cố',
            path: '#/dashboard/menu_level/menu_level_2b',
          },
        ],
      },
      {
        title: 'Thống kê',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.analytics,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
      },
      {
        title: 'role',
        path: PATH_DASHBOARD.role,
        icon: ICONS.dashboard,
      },
      {
        title: 'warehouse',
        path: PATH_DASHBOARD.warehouse,
        icon: ICONS.dashboard,
      },
    ],
  },
];

export default navConfig;
