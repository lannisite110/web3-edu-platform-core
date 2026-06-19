export const plugin = {
  id: 'edu.hot.mock',
  title: 'Mock Lab (E2E Smoke)',
  routePrefix: '/labs/edu.hot.mock',
  routes: [{ path: '', component: () => import('./MockLab.vue') }],
  apiBase: '/api/v1/labs/edu.hot.mock',
}

export default plugin
