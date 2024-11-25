
// views/PostView.vue
<template>
  <article v-if="post" class="blog-post">
    <header>
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <time>{{ formatDate(post.date) }}</time>
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </header>
    <div class="content" v-html="post.content"></div>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContentBySlug } from '@/utils/content'

const route = useRoute()
const post = ref(null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  post.value = await getContentBySlug('field_notes', route.params.slug)
})
</script>

<style scoped>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 2rem;
  color: #666;
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 999px;
  font-size: 0.875rem;
}

.content {
  line-height: 1.8;
}

.content :deep(h2) {
  margin: 2rem 0 1rem;
}

.content :deep(p) {
  margin: 1rem 0;
}
</style>