<template>
  <Comp>
      <p>default slot</p>
      <template v-slot:slot1>
        <p>slot1</p>
      </template>
      <template #slot2="{ msg }" >
        <p>slot2:{{ msg }}</p>
      </template>
      <template v-slot:customSlot>
        <p>slot3</p>
      </template>
  </Comp>
</template>
<script setup>
// import Comp from './Comp.vue'
import Comp from './Comp.js'

</script>
