<template>
  <RouterLink
    v-if="'routeName' in item"
    :to="{ name: item.routeName } as RouteLocationRaw"
    class="menu-item menu-item--link"
    :class="cssClasses"
  >
    {{ $t(item.titleSlug) }}
  </RouterLink>
  <div v-else class="menu-item">
    <Component :is="item.component" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type RouteLocationRaw, useRoute } from 'vue-router'

import type { EventMenuItem } from '@/core/EventMenu.ts'
import { isItemActive } from '@/navigation/eventMenu/utils'

const props = defineProps<{
  item: EventMenuItem
}>()

const route = useRoute()

const cssClasses = computed(() => ({
  'menu-item--active': isActive.value,
}))

const isActive = computed(() => {
  if (route.name === undefined || route.name === null) {
    throw new Error('Route name is not defined')
  }
  return isItemActive(props.item, route)
})
</script>

<style scoped lang="scss">
@use '@/styles/colors.scss';
@use 'digicomponents/dist/variables';
@use './eventMenuStyles';

.menu-item {
  padding: calc(#{variables.$spacing-sm} * 0.7) variables.$spacing-sm;
  color: variables.$muted-foreground;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
  border-radius: variables.$radius-md;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;

  &--link {
    &.menu-item--active,
    &:hover {
      @include eventMenuStyles.activeStyle;
      text-decoration: none;
    }
  }
}
</style>
