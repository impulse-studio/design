<template>
  <RouterLink
    v-if="location"
    :to="location"
    class="menu-section__header menu-section__header--link"
  >
    <DigiRemixIcon :name="section.iconName" class="menu-section__icon" />

    <div class="menu-section__header-center">
      <span class="menu-section__title">{{ $t(section.titleSlug) }}</span>
    </div>
  </RouterLink>
  <div v-else class="menu-section__header menu-section__header--link">
    <DigiRemixIcon
      :name="section.iconName"
      size="lg"
      class="menu-section__icon"
    />

    <div class="menu-section__header-center">
      <span class="menu-section__title">{{ $t(section.titleSlug) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DigiRemixIcon } from 'digicomponents'
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { isEventMenuItemLink } from '@/core/EventMenu'
import type { EventMenuItem, EventMenuSection } from '@/navigation/eventMenu'

const props = defineProps<{
  section: EventMenuSection
}>()

const firstItem = computed((): EventMenuItem | undefined => {
  return props.section.items[0]
})

const location = computed(() => {
  return firstItem.value && isEventMenuItemLink(firstItem.value)
    ? ({
        name: firstItem.value.routeName,
      } as RouteLocationRaw)
    : undefined
})
</script>

<style scoped lang="scss">
@use '../eventMenuStyles';

.menu-section {
  @include eventMenuStyles.menuSectionStyle;
}
.menu-section__header {
  color: inherit;

  &:hover {
    text-decoration: none;
  }
}
</style>
