<template>
    {{ profileId }}
</template>

<script lang = "ts" setup>
const profileId = useRoute().params.profileId;
</script>