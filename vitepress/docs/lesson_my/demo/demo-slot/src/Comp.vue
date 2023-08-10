<template>
    <div>
        <slot></slot>
        <slot name="slot1"></slot>
        <slot name="slot2" msg="hello world"></slot>
        <slot :name="slotName">
            <!-- 默认插槽内容 -->
            默认插槽内容
        </slot>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const slotName = ref('defaultSlot');

</script>
