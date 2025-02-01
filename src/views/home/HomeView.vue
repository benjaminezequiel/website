<template>
  <!-- <div class="huge-clip-path"></div> -->
  <div class="home__border">
    <div class="custom_mouse_button"></div>
    <div class="home__page">
      <!-- <div class="transparent-circle"></div> -->
      <div class="home__content">
        <div class="info_cards">
          <div class="info_cards--item">
            <div class="info-faint">RENDERING</div>
            <div>2025-05-01</div>
          </div>
          <div class="info_cards--item"></div>
          <div class="info_cards--item"></div>
          <div class="info_cards--item"></div>
        </div>
        <div class="info_card">
          <div class="last_updated">
            <span class="info-faint">RENDERING INFO</span>
            <span>2025-05-01 | 17:18:16</span>
          </div>
          <div class="last_updated">
            <span class="info-faint">LAST UPDATED</span>
            <span>2025-05-01 | 17:18:16</span>
          </div>
          <div class="currently_reading">
            <span class="info-faint">CURRENTLY READING</span>
            <span
              ><a href="https://www.goodreads.com/book/show/841.Emotional_Design" target="_blank">
                Emotional Design, Don Norman
              </a>
            </span>
          </div>
          <div class="copyright">
            <span class="info-faint">COPYRIGHT</span>
            <span>EZBEN @2025</span>
          </div>
        </div>
        <img src="/assets/logo/ezben.svg" alt="" class="logo-test" />
        <HomeBackground :class="expanded ? 'expanded' : ''" />
        <vAscii
          style="scale: v-bind(rangeFOV)"
          class="home__ascii"
          :class="expanded ? 'expanded' : ''"
          modelPath="/assets/object_to_ascii.obj"
          :asciiConfig="{
            width: 200,
            height: 60,
            chars: charSet,
            renderWidth: 320,
            renderHeight: 160,
          }"
          :cameraConfig="{
            fov: rangeFOV,
            position: { x: 0, y: 0, z: 50 },
          }"
          :controlsConfig="{
            autoRotateSpeed: rangeValue * 2,
            enableZoom: enableZoom,
            dampingFactor: dampingRange / 100,
          }"
          :show-debug="false"
        />
        <WelcomeTitle @click="handleWelcomeClick" class="home__welcome-title" />
      </div>
      <!-- <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at fringilla dolor, et
        viverra velit. Nunc faucibus vulputate tellus at lobortis. Nullam placerat tristique odio,
        at hendrerit purus pellentesque nec. Donec ultricies ante sit amet quam pretium, et eleifend
        eros fermentum. Sed eros ex, hendrerit vitae mollis id, iaculis a lacus. Sed euismod varius
        dictum. Integer mattis suscipit elementum. Fusce ultricies faucibus porta. Duis sed volutpat
        lacus, nec tempus diam. Nullam dapibus ex nisi, id euismod erat auctor non. Nam id diam
        rhoncus, varius odio vitae, luctus mauris. Integer sit amet ex sed lacus imperdiet
        ultricies. Integer quis magna tortor. Donec eu tellus ut leo feugiat ultricies id sed metus.
        Donec ut urna tincidunt, interdum odio eget, convallis velit. Mauris sed fermentum felis,
        finibus varius nisl. Vestibulum placerat lectus eget auctor gravida. Donec porttitor
        fermentum ultrices. Nullam cursus arcu ligula, quis varius mauris scelerisque id. Ut
        tristique metus nec enim euismod efficitur non quis dui.
      </p> -->
      <!-- <div class="test-white-strip"></div> -->
    </div>
    <div class="controls">
      <input type="range" id="volume" name="volume" min="0" max="25" v-model="rangeValue" />
      <input type="text" v-model="charSet" />
      <input type="range" id="VOLUME" name="volume" min="1" max="30" v-model="rangeFOV" />
      <input type="range" id="VOLUME" name="volume" min="1" max="10" v-model="dampingRange" />
      <input type="checkbox" v-model="enableZoom" />
    </div>
  </div>
  <!-- <div class="circle-3D"><img src="" alt="" /></div>
  <div class="circle-3D-1"><img src="" alt="" /></div>
  <div class="circle-3D-2"><img src="" alt="" /></div> -->
  <!-- <div class="recently-added">
    <div class="recent-item"></div>
    <div class="recent-item"></div>
    <div class="recent-item"></div>
    <div class="recent-item"></div>
    <div class="recent-item"></div>
  </div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeBackground from './components/HomeBackground/HomeBackground.vue'
import WelcomeTitle from './components/WelcomeTitle/WelcomeTitle.vue'
import vAscii from '../../components/vAscii/vAscii.vue'
const rangeValue = ref(1)
const charSet = ref(' .:+#@')
const expanded = ref(true)
const rangeFOV = ref(15)
const enableZoom = ref(false)
const dampingRange = ref(2)

const handleWelcomeClick = () => {
  if (expanded.value) {
    expanded.value = false
    return
  }
  expanded.value = true
}
</script>

<style scoped lang="scss">
@use './styles.scss';
</style>
