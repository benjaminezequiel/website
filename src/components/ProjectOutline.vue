<template>
  <div class="outline--container">
    <div class="outline" :class="{ 'outline--expanded': isExpanded }">
      <button
        class="outline__toggle"
        @click="toggleExpanded"
        :aria-label="isExpanded ? 'Collapse outline' : 'Expand outline'"
      >
        <div class="outline__toggle-text">
          <span class="outline__title">Project Outline</span>
          <span class="outline__count">{{ headers.length }} sections</span>
        </div>
        <svg
          class="outline__toggle-icon"
          :class="{ 'outline__toggle-icon--expanded': isExpanded }"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <nav v-if="isExpanded" class="outline__nav">
        <ul class="outline__list">
          <li
            v-for="header in headers"
            :key="header.id"
            class="outline__item"
            :class="`outline__item--h${header.level}`"
          >
            <a
              :href="`#${header.id}`"
              class="outline__link"
              :class="{ 'outline__link--active': activeId === header.id }"
              @click.prevent="scrollToHeader(header.id)"
            >
              {{ header.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

const isExpanded = ref(false)
const headers = shallowRef([]) // Using shallowRef for better performance
const activeId = ref(null)
let headerPositions = [] // Cache header positions
let ticking = false // For RequestAnimationFrame

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const generateId = (text, index) => {
  return `heading-${index}`
}

const initializeHeaders = () => {
  const article = document.querySelector('.page')
  if (!article) return

  const contentDiv = article.querySelector('.project--content')
  if (!contentDiv) return

  const headerElements = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')

  // Process headers and cache their positions
  const processedHeaders = Array.from(headerElements).map((header, index) => {
    const id = generateId(header.textContent, index)
    header.id = id
    return {
      id,
      text: header.textContent,
      level: parseInt(header.tagName.charAt(1)),
    }
  })

  headers.value = processedHeaders
  cacheHeaderPositions()

  if (headers.value.length > 0) {
    activeId.value = headers.value[0].id
  }
}

const cacheHeaderPositions = () => {
  headerPositions = headers.value.map((header) => {
    const element = document.getElementById(header.id)
    return {
      id: header.id,
      top: element ? element.offsetTop : 0,
    }
  })
}

const scrollToHeader = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const headerHeight = 120
    const offsetPosition = element.offsetTop - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

const updateActiveHeader = () => {
  if (!headerPositions.length) return

  const scrollPosition = window.scrollY + 150
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const bottomThreshold = 100 // Pixels from bottom to trigger last item

  // Check if we're near the bottom of the page
  if (scrollPosition + windowHeight >= documentHeight - bottomThreshold) {
    // Set the last header as active
    activeId.value = headerPositions[headerPositions.length - 1].id
    return
  }

  // Regular binary search for other cases
  let start = 0
  let end = headerPositions.length - 1
  let activeHeader = headerPositions[0]

  while (start <= end) {
    const mid = Math.floor((start + end) / 2)
    const current = headerPositions[mid]

    if (current.top <= scrollPosition) {
      activeHeader = current
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  activeId.value = activeHeader.id
}

// const updateActiveHeader = () => {
//   if (!headerPositions.length) return

//   const scrollPosition = window.scrollY + 150

//   // Binary search for better performance with many headers
//   let start = 0
//   let end = headerPositions.length - 1
//   let activeHeader = headerPositions[0]

//   while (start <= end) {
//     const mid = Math.floor((start + end) / 2)
//     const current = headerPositions[mid]

//     if (current.top <= scrollPosition) {
//       activeHeader = current
//       start = mid + 1
//     } else {
//       end = mid - 1
//     }
//   }

//   activeId.value = activeHeader.id
// }

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveHeader()
      ticking = false
    })
    ticking = true
  }
}

const handleResize = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      cacheHeaderPositions()
      updateActiveHeader()
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  // Initialize after content is rendered
  setTimeout(() => {
    initializeHeaders()
    updateActiveHeader()
  }, 100)

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.outline--container {
  position: absolute;
  right: -24px;
  @media (max-width: 1400px) {
    position: static;
  }
}

.outline {
  box-shadow: 0px 4px 12px -2px rgba(0, 0, 0, 0.5);
  position: fixed;
  transform: translateY(-50%);
  top: 50%;
  width: 240px;
  height: fit-content;
  background-color: var(--gray-100);
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
  z-index: 100;
  transition: height var(--ease-out) 200ms;

  @media (max-width: 1400px) {
    position: static;
    width: 100%;
    transform: unset;
  }
}

.outline__toggle {
  width: 100%;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--gray-800);

  &:hover {
    background-color: var(--gray-200);
  }
}

.outline__toggle-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.outline__title {
  font-weight: 500;
  font-size: 0.875rem;
}

.outline__count {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.outline__toggle-icon {
  transition: transform 0.2s ease;

  &--expanded {
    transform: rotate(90deg);
  }
}

.outline__nav {
  max-height: calc(100vh - 16rem);
  overflow-y: auto;
  padding: 0.5rem;
}

.outline__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.outline__item {
  margin: 0.2rem 0;

  &--h1 {
    margin-left: 0;
  }
  &--h2 {
    margin-left: 0rem;
  }
  &--h3 {
    margin-left: 0rem;
  }
  &--h4 {
    margin-left: 1rem;
  }
  &--h5 {
    margin-left: 2rem;
  }
}

.outline__link {
  display: block;
  padding: 0.25rem 0.5rem;
  color: var(--gray-500);
  text-decoration: none;
  font-size: 0.875rem;

  text-transform: capitalize;
  border-radius: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: var(--gray-200);
    color: var(--gray-900);
  }

  &--active {
    background-color: var(--gray-200);
    color: var(--gray-900);
    font-weight: 500;
  }
}

.outline__nav {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-200);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-400);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray-500);
  }
}
</style>
