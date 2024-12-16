// views/BlogView.vue
<template>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/utils/content'
import Nav from '@/components/Nav.vue'

const posts = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  posts.value = await getContent('blog')
})
</script>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.post-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 999px;
  font-size: 0.875rem;
}
</style>
