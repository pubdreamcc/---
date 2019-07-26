import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/admin'
    },
    {
      path: '/admin',
      component: resolve => require(['../components/Admin.vue'], resolve),
      name: 'Admin',
      children: [
        {
          path: 'contentaudit',
          component: resolve => require(['../components/ContentAudit.vue'], resolve),
          name: 'ContentAudit'
        },
        {
          path: 'contentedit',
          component: resolve => require(['../components/ContentEdit.vue'], resolve),
          name: 'ContentEdit'
        },
        {
          path: 'videoaudit',
          component: resolve => require(['../components/VideoAudit.vue'], resolve),
          name: 'VideoAudit'
        }
      ]
    }
  ]
})
