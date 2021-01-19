import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/views/LandingPage').default
    },
    {
      path: '/home',
      name: 'Home',
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/Home.vue')
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/UserInfo.vue')
    },
    {
      path: '/previewFile',
      name: 'PreviewFile',
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/PreviewFile.vue')
    },
    {
      path: '/file',
      name: 'File',
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/File.vue')
    }
  ]
})
