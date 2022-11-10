<template>
    <el-menu router :default-openeds="['1']" :collapse="isCollapsed" active-text-color="#ffd04b"
        background-color="#545c64" text-color="#fff">
        <!-- <el-sub-menu index="/goods/list">
            <template #title>
                <el-icon>
                    <Clock />
                </el-icon>
                <span>商品管理</span>
            </template>
            <el-menu-item index="/goods/category/">
                <el-icon>
                    <DocumentAdd />
                </el-icon>
                <span>商品分类</span>
            </el-menu-item>
            <el-menu-item index="/goods/release/">
                <el-icon>
                    <DocumentAdd />
                </el-icon>
                <span>发布商品</span>
            </el-menu-item>
            <el-menu-item index="/goods/list">
                <el-icon>
                    <DocumentAdd />
                </el-icon>
                <span>商品列表</span>
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/order/list">
            <template #title>
                <el-icon>
                    <Document />
                </el-icon>
                <span>订单管理</span>
            </template>
            <el-menu-item index="/order/list">
                <el-icon>
                    <Memo />
                </el-icon>
                <span>订单列表</span>
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu>
            <template #title>
                <el-icon>
                    <DataBoard />
                </el-icon>
                <span>账户设置</span>
            </template>
            <el-menu-item index="/account/message">
                <el-icon>
                    <Calendar />
                </el-icon>
                <span>账户信息</span>
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/user/list">
            <template #title>
                <el-icon>
                    <OfficeBuilding />
                </el-icon>
                <span>用户管理</span>
            </template>
            <el-menu-item index="/user/list">
                <el-icon>
                    <User />
                </el-icon>
                <span>用户列表</span>
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/menu/role">
            <template #title>
                <el-icon>
                    <SetUp />
                </el-icon>
                <span>权限设置</span>
            </template>
            <el-menu-item index="/set/role">
                <el-icon>
                    <Picture />
                </el-icon>
                <span>用户角色</span>
            </el-menu-item>
            <el-menu-item index="/set/menu">
                <el-icon>
                    <Link />
                </el-icon>
                <span>菜单权限</span>
            </el-menu-item>
        </el-sub-menu> -->

        <!-- axaj生成侧边栏菜单： -->
        <template v-for="menu in menu_tree">
            <!-- 双层嵌套 -->
            <!--此处:index="menu.id" 只是折叠/收起菜单（不需要跳转），只要id不重复即可  -->
            <el-sub-menu v-if="menu.children" :index="menu.id">
                <template #title>
                    <span>{{menu.name}}</span>
                </template>
                <!-- 子菜单循环生成 -->
                <el-menu-item v-for="submenu in menu.children" :index="submenu.path">
                    <span>{{submenu.name}}</span>
                </el-menu-item>
            </el-sub-menu>
            <!-- 单层 -->
            <el-menu-item v-else :index="menu.path">
                <template #title>
                    <span>{{menu.name}}</span>
                </template>
            </el-menu-item>
        </template>

    </el-menu>
</template>


<script setup>
import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/menu'
import { onMounted, ref, reactive } from 'vue';
import Role from '@/api/role';

//配合NavBar 按钮伸缩侧边栏：
//初始化useMenuStore
let menu = useMenuStore()
//为了从Store中提取属性同时保持其响应式，您需要使用storeToRefs()。它将为任何响应式属性创建refs。
let { isCollapsed } = storeToRefs(menu);

//根据不同的账户显示不同的侧边栏菜单：
//先拿到登录的账号
let id = sessionStorage.id;
let menu_tree = ref([]);
//挂载完成阶段（发送axios，获取侧边栏菜单）
onMounted(async () => {
    let { status, data } = await Role.menu({ id, type: 'tree' });
    if (status) {
        menu_tree.value = data;
    }
})



</script>

<style lang="less">
.el-menu {
    //去掉侧边边框（默认）
    border: 0;
}

.side-bar {
    color: white;
    border-right: 0;
}

// .el-menu-vertical-demo:not(.el-menu--collapse) {
//     width: 200px;
// }
</style> 