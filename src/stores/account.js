import { ref } from 'vue'
import { defineStore } from 'pinia'

import Account from '@/api/account'

export const useAccountStore = defineStore('account', () => {
    //state--当前账户
    let profile = ref({})

    //actions--加载账户资料
    let loadProfile = async (id) => {
        try {
            let { status, msg, data } = await Account.info({ id });
            if (status) {
                profile.value = data;
            }
        } catch (error) {
            console.log(error)
        }
    }
    //actions--修改账户资料
    let updateProfile = async (data) => {
        try {
            let { status, msg } = await Account.edit(data);
            if (status) {
                //更新state
                profile.value = { ...data };
                //成功提示
                ElMessage.success(msg);
            } else {
                //失败提示
                ElMessage.error(msg);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return {
        profile,
        loadProfile,
        updateProfile,
    }
}, { persist: true })
