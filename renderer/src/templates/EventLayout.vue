<template>
  <!-- Mirrors back/src/layouts/eventLayout/EventLayout.vue (desktop), without the business modals. -->
  <div class="event-layout" :class="{ 'event-layout--menu-close': !menuOpen }">
    <DigiSidebar class="event-layout__menu">
      <template #top>
        <MenuEventAbstract />
      </template>
      <template #main>
        <slot name="main-actions" />
        <div class="event-menu__sections">
          <BaseMenuSection v-for="section in menuSections" :key="section.key" :section="section" />
        </div>
      </template>
      <template #bottom>
        <slot name="bottom">
          <DigiButton variant="ghost" icon-name="star-line">{{ $t('EVENT_MENU_PRODUCT_CHANGES_CTA') }}</DigiButton>
          <DigiButton variant="ghost" icon-name="question-line">Aide</DigiButton>
          <DigiButton variant="ghost" icon-name="account-circle-line">{{ accountName }}</DigiButton>
        </slot>
      </template>
    </DigiSidebar>

    <div class="event-layout__content">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DigiButton } from 'digicomponents'
import { computed, watchEffect } from 'vue'

import DigiSidebar from '@/components/ui/DigiSidebar.vue'
import type { EventMenuSection } from '@/core/EventMenu'
import MenuEventAbstract from '@/layouts/eventLayout/parts/MenuEventAbstract.vue'
import BaseMenuSection from '@/navigation/eventMenu/components/menuSection/BaseMenuSection.vue'
import { mockEvent } from '@/store/useEventStore'

import { ensureRoute, router } from '../router'

import { DEFAULT_EVENT, DEFAULT_MENU_SECTIONS, type MenuSectionInput } from './constants'

const props = withDefaults(
  defineProps<{
    eventName?: string
    eventDate?: string
    sections?: MenuSectionInput[]
    activeRoute?: string
    menuOpen?: boolean
    accountName?: string
  }>(),
  {
    eventName: DEFAULT_EVENT.name,
    eventDate: DEFAULT_EVENT.startDate,
    sections: () => DEFAULT_MENU_SECTIONS,
    activeRoute: undefined,
    menuOpen: true,
    accountName: DEFAULT_EVENT.accountName,
  },
)

watchEffect(() => {
  mockEvent.name = props.eventName
  mockEvent.startDate = props.eventDate
})

const menuSections = computed<EventMenuSection[]>(() =>
  props.sections.map((section, i) => ({
    key: section.key ?? `section-${i}`,
    titleSlug: section.title,
    iconName: section.icon,
    items: section.items.map((item) => {
      ensureRoute(item.route)
      return { titleSlug: item.title, routeName: item.route }
    }),
  })),
)

watchEffect(() => {
  if (!props.activeRoute) return
  ensureRoute(props.activeRoute)
  void router.replace({ name: props.activeRoute })
})
</script>

<style lang="scss" scoped>
@use '@/styles/navigationStyle';
@use 'digicomponents/dist/variables' as digiVars;

.event-layout {
  display: grid;
  height: 100vh;
  grid-template-columns: navigationStyle.$navWidth 1fr;
  grid-template-areas: 'menu content';
  transition: grid-template 0.3s ease-in-out;

  &--menu-close {
    grid-template-columns: #{digiVars.$spacing-md} 1fr;

    .event-layout__menu {
      overflow: hidden;
    }
  }

  &__menu {
    display: flex;
    grid-area: menu;
    border-right: 1px solid digiVars.$border;
    padding-top: digiVars.$spacing-md;
    min-height: 0;
  }

  &__content {
    grid-area: content;
    height: 100%;
    overflow-y: auto;
    display: grid;
    width: 100%;
    min-width: 0;
  }

  .event-menu__sections {
    display: grid;
    grid-template-columns: 1fr;
    gap: calc(#{digiVars.$spacing-sm} * 0.5);
  }
}
</style>
