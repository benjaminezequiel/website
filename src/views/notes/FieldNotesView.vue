<template>
  <div class="page-container">
    <div class="page">
      <header class="header">
        <h1 class="header__title">
          <span class="material-symbols-outlined header__title-icon">description</span>
          <span>NOTES</span>
        </h1>
      </header>
      <div class="notes_list">
        <router-link
          v-for="note in notes"
          :key="note.slug"
          :to="{ name: 'note', params: { slug: note.slug } }"
          class="note_item"
        >
          <div class="note__left-container">
            <h1 class="note-title">{{ note.title }}</h1>
            <div class="note_tag-list">
              <span v-for="tag in note.tags" class="note_tag" :tag="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="note__right-container">
            <span class="note_date">{{ note.date }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<!-- <template>
  <Nav active="notes"></Nav>
  <div class="blog-posts">
    <h1>Blog</h1>
    <div class="posts-grid">
      <article v-for="post in posts" :key="post.slug" class="post-card">
        <RouterLink :to="{ name: 'post', params: { slug: post.slug } }">
          <h2>{{ post.title }}</h2>
          <time>{{ formatDate(post.date) }}</time>
          <p v-if="post.excerpt">{{ post.excerpt }}</p>
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </RouterLink>
      </article>
    </div>
  </div>
</template> -->

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/utils/content'
import Nav from '@/components/Nav/Nav.vue'

const notes = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  notes.value = await getContent('notes')
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
