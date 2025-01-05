<template>
  <div ref="container" class="ascii-background" @mousemove="handleMouseMove">
    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="ascii-row">
      <span
        v-for="(char, colIndex) in row"
        :key="colIndex"
        class="ascii-char"
        :style="{
          opacity: getOpacity(rowIndex, colIndex),
          transform: `rotate(${getRotation(rowIndex, colIndex)}deg)`,
        }"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsciiBackground',
  data() {
    return {
      grid: [],
      chars: ['·', '∶', '∴', '∷', '⋮', '⋯', '⋰', '⋱'],
      rows: 20,
      cols: 40,
      mouseX: 0,
      mouseY: 0,
    }
  },
  mounted() {
    this.initGrid()
    // Refresh grid periodically for subtle animation
    setInterval(this.refreshRandomChar, 1000)
  },
  methods: {
    initGrid() {
      this.grid = Array(this.rows)
        .fill()
        .map(() =>
          Array(this.cols)
            .fill()
            .map(() => this.chars[Math.floor(Math.random() * this.chars.length)]),
        )
    },
    refreshRandomChar() {
      const row = Math.floor(Math.random() * this.rows)
      const col = Math.floor(Math.random() * this.cols)
      this.$set(this.grid[row], col, this.chars[Math.floor(Math.random() * this.chars.length)])
    },
    handleMouseMove(event) {
      const rect = this.$refs.container.getBoundingClientRect()
      this.mouseX = event.clientX - rect.left
      this.mouseY = event.clientY - rect.top
    },
    getOpacity(row, col) {
      if (!this.$refs.container) return 0.3
      const rect = this.$refs.container.getBoundingClientRect()
      const charWidth = rect.width / this.cols
      const charHeight = rect.height / this.rows
      const charX = col * charWidth + charWidth / 2
      const charY = row * charHeight + charHeight / 2
      const distance = Math.sqrt(
        Math.pow(charX - this.mouseX, 2) + Math.pow(charY - this.mouseY, 2),
      )
      const maxDistance = Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2))
      return 0.3 + (1 - distance / maxDistance) * 0.7
    },
    getRotation(row, col) {
      if (!this.$refs.container) return 0
      const rect = this.$refs.container.getBoundingClientRect()
      const charX = col * (rect.width / this.cols)
      const charY = row * (rect.height / this.rows)
      const angleRad = Math.atan2(this.mouseY - charY, this.mouseX - charX)
      return (angleRad * 180) / Math.PI + 90
    },
  },
}
</script>

<style scoped>
.ascii-background {
  width: 100%;
  height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: monospace;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.ascii-row {
  display: flex;
  justify-content: center;
  line-height: 1;
}

.ascii-char {
  transition: all 0.3s ease;
  display: inline-block;
  padding: 0.2em;
}
</style>
