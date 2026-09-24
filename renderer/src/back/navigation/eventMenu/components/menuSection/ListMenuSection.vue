<template>
  <div :class="classes">
    <div class="menu-section__header" @click="toggle">
      <DigiRemixIcon :name="section.iconName" class="menu-section__icon" />

      <div class="menu-section__header-center">
        <span class="menu-section__title">{{ $t(section.titleSlug) }}</span>
      </div>
    </div>
    <div class="menu-section__content">
      <div class="menu-section__indicator" />
      <nav class="menu-section__list">
        <MenuItem v-for="(item, i) in section.items" :key="i" :item="item" />
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DigiRemixIcon } from 'digicomponents'
import { ref, computed } from 'vue'

import type { EventMenuSection } from '@/core/EventMenu.ts'

import MenuItem from '../MenuItem.vue'

const props = defineProps<{
  section: EventMenuSection
  isActive?: boolean
}>()

const isOpenLocally = ref(props.isActive)

const classes = computed(() => ({
  'menu-section--expanded': isOpenLocally.value,
}))

function toggle(): void {
  isOpenLocally.value = !isOpenLocally.value
}

function close(): void {
  isOpenLocally.value = false
}

function open(): void {
  isOpenLocally.value = true
}

defineExpose({
  open,
  close,
})
</script>

<style scoped lang="scss">
@use '@/styles/colors.scss';
@use '../eventMenuStyles';
@use 'digicomponents/dist/variables';

.menu-section {
  @include eventMenuStyles.menuSectionStyle;

  &__header {
    padding-right: variables.$spacing-md;
    &::after {
      align-self: flex-start;
      justify-self: center;
      $borders: colors.$black 1px solid;
      content: '';
      display: block;
      height: 7px;
      width: 7px;
      border-top: $borders;
      border-right: $borders;
      transition: transform 0.15s ease-in-out;
      transform: translateY(7px) rotate(45deg);
    }
  }

  &__content {
    display: flex;
  }

  &__indicator {
    border-right: 1px solid variables.$border;
    margin-left: calc(#{variables.$spacing-sm} + 0.5ch + 2px);
    margin-right: variables.$spacing-sm;
    align-self: stretch;
  }

  &__list {
    display: grid;
    height: auto;
    max-height: 0;
    gap: calc(#{variables.$spacing-sm} * 0.2);
    transition: max-height 0.15s ease-out;
    overflow: hidden;
    flex-grow: 2;
  }

  &--expanded {
    .menu-section__list {
      max-height: 500px;
      transition: max-height 0.25s ease-in;
    }

    .menu-section__header {
      margin-bottom: calc(#{variables.$spacing-sm} * 0.5);
      &::after {
        transform: translateY(5px) rotate(135deg);
      }
    }
  }
}

.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: max-height 0.15s ease-out;

  max-height: 500px;
}

.fadeHeight-enter,
.fadeHeight-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
