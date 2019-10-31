import store from "@/store";

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const roles = store.getters && store.getters.roles;
    const perms = store.getters && store.getters.perms;
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value;

      const hasPermission =
        roles.some(role => {
          return permissionRoles.includes(role);
        }) ||
        perms.some(perm => {
          return permissionRoles.includes(perm);
        });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      } else {
        return;
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`);
    }
  }
};
