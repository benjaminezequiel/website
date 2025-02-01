import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import vAsciiDebugView from '@/views/vAsciiDebugView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/vAscii',
      name: 'vAscii',
      component: vAsciiDebugView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/projects/ProjectsSectionView.vue'),
    },
    {
      path: '/projects/:slug',
      name: 'project',
      component: () => import('@/views/projects/ProjectView/ProjectView.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/notes/NotesView.vue'),
    },
    {
      path: '/field_notes/:slug',
      name: 'note',
      component: () => import('@/views/todo/NoteView.vue'),
    },
    {
      path: '/experiments',
      name: 'experiments',
      component: () => import('@/views/todo/ExperimentsView.vue'),
    },
    {
      path: '/experiments/:slug',
      name: 'experiment',
      component: () => import('@/views/todo/ExperimentView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/todo/AboutView.vue'),
    },
  ],
})

export default router
