<template>
  <RouterLink class="header-logo" :to="{ name: 'eventsList' }">
    <img src="../../assets/logos/digitevent-blue.jpg" />
  </RouterLink>
</template>

<style scoped lang="scss">
.header-logo {
  height: 100%;
  flex-shrink: 0;
  img {
    height: 100%;
    border-radius: 5px;
  }
}
</style>
