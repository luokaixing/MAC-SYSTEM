import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
import componentsRouter from "./modules/components";
import chartsRouter from "./modules/charts";
import tableRouter from "./modules/table";
import nestedRouter from "./modules/nested";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  }
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/home/file"
  // }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/home",
    redirect: "/home/file",
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: "home",
    meta: {
      title: "home",
      icon: "lock",
      roles: ["user"] // you can set roles in root nav
    },
    children: [
      {
        path: "/home/file",
        component: () => import("@/pages/home/index"),
        name: "homepage",
        meta: { title: "home", icon: "dashboard", affix: true }
      },
      {
        path: "/home/share/:link",
        component: () => import("@/pages/home/share"),
        name: "share",
        meta: {
          title: "share",
          icon: "dashboard",
          affix: true,
          roles: ["m:share"]
        }
      },
      {
        path: "/home/edit",
        component: () => import("@/pages/home/edit"),
        name: "edit",
        meta: {
          title: "edit",
          icon: "dashboard",
          affix: true,
          roles: ["m:edit"]
        }
      },
      {
        path: "/home/edit/:id",
        component: () => import("@/pages/home/edit"),
        name: "editPage",
        meta: {
          title: "edit",
          icon: "dashboard",
          affix: true,
          roles: ["m:edit"]
        }
      }
    ]
  },
  {
    path: "/setting",
    redirect: "/setting",
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: "setting",
    meta: {
      title: "setting",
      icon: "lock",
      roles: ["user"] // you can set roles in root nav
    },
    children: [
      {
        path: "/setting",
        component: () => import("@/pages/setting"),
        name: "setting",
        meta: { title: "setting", icon: "dashboard", affix: true }
      }
    ]
  },

  {
    path: "/",
    component: Layout,
    redirect: "/home/file",
    meta: {
      title: "admin",
      icon: "lock",
      roles: ["user"] // you can set roles in root nav
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/admin",
    meta: {
      title: "admin1",
      icon: "lock",
      roles: ["manager"] // you can set roles in root nav
    }
  },
  {
    path: "/admin",
    redirect: "/admin/perm",
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: "admin2",
    meta: {
      title: "admin",
      icon: "lock",
      roles: ["manager"] // you can set roles in root nav
    },
    children: [
      {
        path: "/admin/perm",
        component: () => import("@/pages/admin/index"),
        name: "admin",
        meta: { title: "admin", icon: "dashboard", affix: true }
      },
      {
        path: "/admin/user",
        component: () => import("@/pages/admin/user"),
        name: "user",
        meta: { title: "user", icon: "dashboard", affix: true }
      },
      {
        path: "/admin/model",
        component: () => import("@/pages/admin/model"),
        name: "model",
        meta: { title: "model", icon: "dashboard", affix: true }
      },
      {
        path: "/admin/language",
        component: () => import("@/pages/admin/language"),
        name: "language",
        meta: { title: "language", icon: "dashboard", affix: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
