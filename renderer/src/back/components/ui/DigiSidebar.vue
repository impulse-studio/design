<template>
  <div class="event-menu">
    <div class="event-menu__top">
      <slot name="top" />
    </div>
    <div class="event-menu__container">
      <slot name="main" />
    </div>
    <div class="event-menu__bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/colors';
@use '@/styles/vars';
@use 'digicomponents/dist/variables';

.event-menu {
  display: flex;
  flex-direction: column;
  position: relative;

  height: 100%;
  z-index: 1;
  background: hsl(var(--off-white) / 0.3);

  &__container {
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: variables.$spacing-md;
    gap: variables.$spacing-md;
    scrollbar-width: thin;
    scrollbar-color: variables.$border;
  }

  &__cta {
    width: 100%;
  }

  &__sections {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: flex-start;
    gap: calc(#{variables.$spacing-sm} * 0.5);
  }

  &__preview-site-btn {
    width: max-content;
  }

  &__bottom {
    display: flex;
    margin-top: auto;
    flex-direction: column;
    width: 100%;
    gap: calc(#{variables.$spacing-sm} * 0.5);
    padding: variables.$spacing-md;
    padding-top: variables.$spacing-sm;
    border-top: 1px solid variables.$border;

    :deep(button) {
      width: 100%;

      > span {
        justify-content: flex-start;
        font-weight: normal;
        gap: variables.$spacing-sm;
        padding: variables.$spacing-sm;
      }

      > button,
      &:not(:has(button)) {
        height: auto;
        padding: 0;
      }
    }
  }

  &__top {
    flex-shrink: 2;
    gap: variables.$spacing-sm;
    padding: 0 variables.$spacing-md variables.$spacing-md
      calc(#{variables.$spacing-md} + #{variables.$spacing-sm});
    border-bottom: 1px solid variables.$border;
  }
}
</style>
