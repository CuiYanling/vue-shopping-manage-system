import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
    //state
    let isCollapsed = ref(false)
    //getter
    let icon = computed(() => isCollapsed.value ? 'Expand' : 'Fold')
    //折叠菜单
    let toggle = () => {
        isCollapsed.value = !isCollapsed.value;
    };

    return {
        isCollapsed,
        toggle,
        icon,
    }
})