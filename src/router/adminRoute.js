export default [
  {
    path: "/admin/login",
    meta: { layout: "wrapper" },
    component: () => import("@/views/admin/Login")
  },
  {
    path: "/admin",
    meta: { authorize: true },
    component: () => import("@/layouts/AdminLayout"),
    children: [
      {
        path: "",
        meta: { authorize: true },
        component: () => import("@/views/admin/Home"),
      },
      {
        path: "403",
        component: () => import("@/views/admin/403")
      },
      {
        path: "users",
        meta: { authorize: true },
        component: () => import("@/layouts/WrapperLayout"),
        children: [
          {
            path: "",
            meta: { authorize: true, permissions: ["user:read"] },
            component: () => import("@/views/admin/Users/UserList"),
          },
          {
            path: "create",
            meta: { authorize: true, permissions: ["user:create"] },
            component: () => import("@/views/admin/Users/UserCreate"),
          },
          {
            path: ":id/edit",
            meta: { authorize: true, permissions: ["user:read", "user:update"] },
            component: () => import("@/views/admin/Users/UserEdit"),
          }
        ]
      },
      {
        path: "roles",
        meta: { authorize: true },
        component: () => import("@/layouts/WrapperLayout"),
        children: [
          {
            path: "",
            meta: { authorize: true, permissions: ["role:read"] },
            component: () => import("@/views/admin/Roles/RoleList"),
          },
          {
            path: "create",
            meta: { authorize: true, permissions: ["role:create"] },
            component: () => import("@/views/admin/Roles/RoleCreate"),
          },
          {
            path: ":id/edit",
            meta: { authorize: true, permissions: ["role:read", "role:update"] },
            component: () => import("@/views/admin/Roles/RoleEdit"),
          },
          {
            path: ":id",
            meta: { authorize: true, permissions: ["role:read"] },
            component: () => import("@/views/admin/Roles/RoleDetail"),
          }
        ]
      },
      {
        path: "permissions",
        meta: { authorize: true },
        component: () => import("@/layouts/WrapperLayout"),
        children: [
          {
            path: "",
            meta: { authorize: true, permissions: ["permission:read"] },
            component: () => import("@/views/admin/Permissions/PermissionList"),
          },
          {
            path: "create",
            meta: { authorize: true, permissions: ["permission:create"] },
            component: () => import("@/views/admin/Permissions/PermissionCreate"),
          },
          {
            path: ":id/edit",
            meta: { authorize: true, permissions: ["permission:read", "permission:update"] },
            component: () => import("@/views/admin/Permissions/PermissionEdit"),
          }
        ]
      },
      {
        path: "routes",
        meta: { authorize: true },
        component: () => import("@/layouts/WrapperLayout"),
        children: [
          {
            path: "",
            meta: { authorize: true, permissions: ["route:read"] },
            component: () => import("@/views/admin/Routes/RouteList"),
          },
          {
            path: "create",
            meta: { authorize: true, permissions: ["route:create"] },
            component: () => import("@/views/admin/Routes/RouteCreate"),
          },
          {
            path: ":id/edit",
            meta: { authorize: true, permissions: ["route:read", "route:read"] },
            component: () => import("@/views/admin/Routes/RouteEdit"),
          }
        ]
      },
      {
        path: "menus",
        meta: { authorize: true },
        component: () => import("@/layouts/WrapperLayout"),
        children: [
          {
            path: "book",
            meta: { authorize: true },
            component: () => import("@/views/admin/Menus/MenuBook"),
          },
          {
            path: "course",
            meta: { authorize: true },
            component: () => import("@/views/admin/Menus/MenuCourse"),
          }
        ]
      },
      {
        path: "*",
        component: () => import("@/views/admin/404"),
      }
    ]
  }
];