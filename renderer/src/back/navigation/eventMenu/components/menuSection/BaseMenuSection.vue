<template>
  <div class="menu-section" :class="classes">
    <LinkMenuSection v-if="isLink" :section="section" />
    <ListMenuSection
      v-else
      ref="menuSection"
      :section="section"
      :is-active="isActive"
    />
  </div>
</template>
<script lang="ts" setup>
import { useTemplateRef, ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { type EventMenuSection, isEventMenuItemLink } from '@/core/EventMenu'

import { isItemActive } from '../../utils'

import LinkMenuSection from './LinkMenuSection.vue'
import ListMenuSection from './ListMenuSection.vue'

const props = defineProps<{
  section: EventMenuSection
}>()
const menuSection = useTemplateRef('menuSection')
const isActive = ref(false)
const classes = computed(() => ({
  'menu-section--active': isActive.value,
}))

const isLink = computed(() => {
  const firstItem = props.section.items[0]
  return (
    props.section.items.length === 1 &&
    firstItem &&
    isEventMenuItemLink(firstItem)
  )
})

const route = useRoute()

function checkRouteActive(): void {
  const hasActiveItems = props.section.items.some((item) =>
    isItemActive(item, route),
  )

  if (props.section.items.length === 1) {
    isActive.value = hasActiveItems
  }

  if (menuSection.value) {
    if (hasActiveItems) menuSection.value.open()
    else menuSection.value.close()
  }
}

watch(() => route.name, checkRouteActive, { immediate: true })

onMounted(checkRouteActive)
</script>
<style lang="scss" scoped>
@use '../eventMenuStyles';

.menu-section {
  @include eventMenuStyles.menuSectionStyle;
}
</style>
