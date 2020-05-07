export default [
  {
    path: '/admin',
    name: "menu.DASHBOARD",
    icon: 'home',
  },
  {
    path: '/admin/categories',
    name: "menu.MANAGE_MENU",
    icon: 'menu',
    children: ['/admin/menus/book', '/admin/menus/course'],
  },
  {
    path: '/admin/menus/book',
    name: "menu.MENU_BOOK",
  },
  {
    path: '/admin/menus/course',
    name: "menu.MENU_COURSE",
  },
  {
    path: '/admin/users',
    name: "menu.MANAGE_USER",
    icon: 'user',
    children: ['/admin/users', '/admin/users/create'],
  },
  {
    path: '/admin/users',
    name: "menu.LIST_USER",
  },
  {
    path: '/admin/users/create',
    name: "menu.ADD_USER",
  },
  {
    name: "menu.MANAGE_ROLE",
    icon: "lock",
    path: "/admin/roles",
    children: ['/admin/roles', '/admin/roles/create'],
  },
  {
    path: '/admin/roles',
    name: "menu.LIST_ROLE",
  },
  {
    path: '/admin/roles/create',
    name: "menu.ADD_ROLE",
  },
  {
    name: "menu.MANAGE_PERMISSION",
    icon: "key",
    path: "/admin/permissions",
    children: ['/admin/permissions', '/admin/permissions/create'],
  },
  {
    path: '/admin/permissions',
    name: "menu.LIST_PERMISSION",
  },
  {
    path: '/admin/permissions/create',
    name: "menu.ADD_PERMISSION",
  },
  {
    name: "menu.MANAGE_ROUTE",
    icon: "branches",
    path: "/admin/routes",
    children: ['/admin/routes', '/admin/routes/create'],
  },
  {
    path: '/admin/routes',
    name: "menu.LIST_ROUTES",
  },
  {
    path: '/admin/routes/create',
    name: "menu.ADD_ROUTE",
  },
];