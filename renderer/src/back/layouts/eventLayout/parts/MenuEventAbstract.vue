<template>
  <div class="d-flex gap-3" style="height: 60px">
    <HeaderLogo />
    <div class="header-event-abstract">
      <DigiRouterLink
        variant="link"
        size="sm"
        icon-name="home-2-line"
        class="w-max"
        :to="{ name: 'eventsList' }"
      >
        {{ $t('BACK_TO_EVENTS') }}
      </DigiRouterLink>
      <div>
        <h1>{{ eventName }}</h1>
        <p class="header-event-abstract__date text-sm">{{ formattedDate }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DigiRouterLink } from 'digicomponents'
import { computed } from 'vue'

import { useEventStore } from '@/store/useEventStore'
import { getDate } from '@/utils/time'

import HeaderLogo from '../../components/HeaderLogo.vue'

const eventStore = useEventStore()

const eventIdentity = eventStore.mustGetIdentity()

const formattedDate = computed(() => {
  return getDate(eventIdentity.value.startDate, eventIdentity.value.timezone)
})

const eventName = computed((): string => {
  return eventIdentity.value.name
})
</script>

<style scoped lang="scss">
@use '@/styles/colors.scss';
@use '@/styles/navigationStyle';
@use 'digicomponents/dist/variables';

.header-event-abstract {
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;

  @include navigationStyle.mobileEventLayoutMixin {
    justify-content: flex-start;
  }

  h1 {
    margin-bottom: 0;
    max-width: 35vw;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
    font-weight: 600;
    line-height: 1;
  }

  p {
    display: inline;
    margin-bottom: 0;
  }

  &__date {
    color: variables.$off-black;
  }

  &__date {
    display: none;

    @include navigationStyle.inversedMobileEventLayoutMixin {
      display: inherit;
    }
  }

  &__back {
    display: none;
    width: max-content;
    text-transform: uppercase;
    transform: translateX(-3px);

    @include navigationStyle.inversedMobileEventLayoutMixin {
      display: flex;
    }
  }
}
</style>
