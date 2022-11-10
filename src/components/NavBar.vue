<!-- 横向导航条 -->
<template>
    <div class="nav-bar">
        <div class="left">
            <el-space>
                <img height="58" class="logo" src="../assets/img/common/logo.png" alt="">
                <el-button class="menu-icon" @click="handleToggle" link :icon="icon"></el-button>
            </el-space>
        </div>
        <el-menu router mode="horizontal" :ellipsis="false" background-color="#31404e" text-color="#fff"
            active-text-color="#ffd04b">
            <el-sub-menu index="1">
                <template #title>
                    <el-space>
                        <el-avatar :src="profile.avatar" />
                        {{profile.fullname}}
                    </el-space>
                </template>
                <el-menu-item>消息</el-menu-item>
                <el-menu-item index="/account/message">设置</el-menu-item>
                <el-menu-item>退出</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu';
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@/stores/account'
import { onMounted } from 'vue'

let account = useAccountStore();

onMounted(() => {
    //加载当前账户资料
    account.loadProfile(sessionStorage.id);
})

//提取账户state
let { profile } = storeToRefs(account)

let menu = useMenuStore();

//提取getters
let { icon } = storeToRefs(menu);


//折叠菜单
let handleToggle = () => {
    menu.toggle();
};


</script>

<style lang="less" scoped>
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #31404e;
    color: white;

    .left {
        display: flex;
        align-items: center;

        .menu-icon {
            color: white;
            font-size: 18px;
        }
    }

    .el-menu {
        border-bottom: 0;
    }
}
</style>
