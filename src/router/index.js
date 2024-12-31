import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
    },
    {
      path: '/projects/:slug',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
    },
    {
      path: '/field_notes',
      name: 'field_notes',
      component: () => import('@/views/todo!/FieldNotesView.vue'),
    },
    {
      path: '/field_notes/:slug',
      name: 'note',
      component: () => import('@/views/todo!/NoteView.vue'),
    },
    {
      path: '/experiments',
      name: 'experiments',
      component: () => import('@/views/todo!/ExperimentsView.vue'),
    },
    {
      path: '/experiments/:slug',
      name: 'experiment',
      component: () => import('@/views/todo!/ExperimentView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/todo!/AboutView.vue'),
    },
  ],
})

export default router
