<!-- <div class="highlights">
  <header>HIGHLIGHTS</header>
  <section>
    <article v-for="item in highlights" :key="item.slug" class="">
      <RouterLink
        class="highlight_item"
        :to="{ name: item.type, params: { slug: item.slug } }"
      >
        <h3>{{ item.title }}</h3>
        <span class="highlight_type">{{ item.type }}</span>
      </RouterLink>
    </article>
  </section>
</div> -->
<!--
<style>

.highlights {
  @include window();
  inset: unset;
  right: var(--space-6);
  bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  max-width: unset;
  width: 280px !important;

  .highlight_item {
    h3 {
      margin: 0;
    }
    width: 100%;
    color: unset;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    transition: padding-left var(--ease-out) 200ms;
    position: relative;
    gap: 8px;
    h3 {
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    > * {
      text-decoration: inherit;
    }
  }
  .highlight_item::before {
    content: '>';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    color: var(--brand-color-3);
    opacity: 0;
    transform: translateX(-100%);
    transition: transform 300ms var(--ease-out);
  }
  .highlight_type {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 14px;
  }
}

.highlight_item:hover {
  color: var(--brand-color-3);
  padding-left: 10px;
  &::before {
    opacity: 1;
    transform: translateX(-150%);
  }
}

.shortcuts {
  @include window();
  inset: unset;
  left: var(--space-6);
  bottom: var(--space-6);
}
</style> -->
