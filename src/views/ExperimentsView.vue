// views/ExperimentsView.vue
<template>
  <div class="experiments">
    <h1>Experiments</h1>
    <div class="experiments-grid">
      <article v-for="experiment in experiments" :key="experiment.slug" class="experiment-card">
        <RouterLink :to="{ name: 'experiment', params: { slug: experiment.slug } }">
          <h2>{{ experiment.title }}</h2>
          <time>{{ formatDate(experiment.date) }}</time>
          <p v-if="experiment.description">{{ experiment.description }}</p>
          <div class="tags">
            <span v-for="tag in experiment.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </RouterLink>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/utils/content'

const experiments = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  experiments.value = await getContent('experiments')
})
</script>

<style scoped>
.experiments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.experiment-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: transform 0.2s;
}

.experiment-card:hover {
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
