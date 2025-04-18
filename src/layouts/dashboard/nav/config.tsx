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
  warehouse: icon('ic_warehouse'),
  supplier: icon('ic_supplier'),
  shield: icon('ic_shield'),
  role: icon('ic_role'),
  product: icon('ic_product'),
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
        path: '#',
        icon: ICONS.analytics,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý kho',
    items: [
      {
        title: 'Người dùng',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
      },
      {
        title: 'Quyền hạn',
        path: PATH_DASHBOARD.role,
        icon: ICONS.role,
      },
      {
        title: 'Nhà kho',
        path: PATH_DASHBOARD.warehouse,
        icon: ICONS.warehouse,
      },
      {
        title: 'Nhà cung cấp',
        path: PATH_DASHBOARD.supplier,
        icon: ICONS.supplier,
      },
      {
        title: 'Xuất kho',
        path: PATH_DASHBOARD.warehosueDispatch,
        icon: ICONS.ecommerce,
      },
      {
        title: 'Biển bảng',
        path: PATH_DASHBOARD.signboard,
        icon: ICONS.product,
      },
      {
        title: 'Dự án',
        path: PATH_DASHBOARD.project,
        icon: ICONS.product,
      },
    ],
  },
];

export default navConfig;
