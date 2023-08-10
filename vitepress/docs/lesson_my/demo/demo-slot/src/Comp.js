import { createElementVNode } from 'vue'
export default {
    setup(props, { slots }) {
        const _default = slots.default();
        const slot1 = slots.slot1();
        const slot2 = slots.slot2({ msg: 'hello' });
        const slotName = slots.customSlot();
        return () => {
            return createElementVNode('div', null, [
                ..._default,
                ...slot1,
                ...slot2,
                ...slotName
            ]);
        };
    },
};