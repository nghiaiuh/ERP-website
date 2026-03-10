<template>
  <NavigationBar sidebar-title="Marketing">
    
  </NavigationBar>
</template>

<script setup lang = "ts">
    await useCheckUser();

    definePageMeta({
      breadcrumbs: [
        { label: 'Marketing', path: '/marketing' },
        { label: 'Chiến Lược', path: '/marketing/chien-luoc' }
      ],
    });
</script>