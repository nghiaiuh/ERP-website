<template>
    <div>
        <h1>About Page</h1>
        <p>This is the about page of our Nuxt.js application.</p>
        {{ counter }}
    </div>
</template>

<script lang = "ts" setup>
    const counter = useState<number>('counter', () => 0);
</script>