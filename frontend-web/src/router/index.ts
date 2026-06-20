import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LearnView from '@/views/LearnView.vue'
import PluginLabHost from '@/views/PluginLabHost.vue'
import { getPluginRegistry } from '@/plugins/loader'

const plugins = getPluginRegistry()

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/learn', name: 'learn', component: LearnView },
  ...plugins.map((p) => ({
    path: `${p.routePrefix}/:pathMatch(.*)*`,
    name: p.id,
    component: PluginLabHost,
    meta: { plugin: p },
  })),
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
