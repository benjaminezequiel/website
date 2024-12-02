// views/ExperimentView.vue
<template>
  <article v-if="experiment" class="experiment">
    <header>
      <h1>{{ experiment.title }}</h1>
      <div class="experiment-meta">
        <time>{{ formatDate(experiment.date) }}</time>
        <div class="tags">
          <span v-for="tag in experiment.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </header>
    <div class="content" v-html="experiment.content"></div>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContentBySlug } from '@/utils/content'

const route = useRoute()
const experiment = ref(null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  experiment.value = await getContentBySlug('experiments', route.params.slug)
})
</script>

<style scoped>
.experiment {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.experiment-meta {
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
