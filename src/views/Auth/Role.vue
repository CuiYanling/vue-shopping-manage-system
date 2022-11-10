<template>
    <el-card class="box-card" style="width: 60%">
        <template #header>
            <div class="card-header">
                <div class="flex">
                    <span>角色列表</span>
                    <el-button type="primary" plain class="button" icon="CirclePlus" @click="handleadd">添加角色</el-button>
                </div>
            </div>
        </template>
        <el-table :data="rolelist" style="width: 100%">
            <el-table-column prop="id" label="#" />
            <el-table-column label="角色" width="140">
                <template #default="scope">
                    <el-tag disable-transitions>
                        {{scope.row.name }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="300" #default="scope">
                <el-space>
                    <el-button type="primary" plain @click="handleEdit(scope.row,scope.$index)"
                        :disabled="scope.row.id===1">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                    </el-button>
                    <el-button type="danger" plain @click="handleRemove(scope.row.id,scope.$index)"
                        :disabled="scope.row.id===1">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                    <el-button type="primary" plain @click="handleMenu(scope.row.id)">
                        <el-icon>
                            <Setting />
                        </el-icon>
                    </el-button>
                </el-space>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 添加按钮 dialog 弹窗 -->
    <el-dialog v-model="dialogVisibleadd" title="添加角色">
        <el-form ref="formRefadd" :rules="rules" :model="formadd">
            <el-form-item label="链接标题" prop="name" status-icon label-width="80px">
                <el-input v-model="formadd.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancleadd">取消</el-button>
                <el-button type="primary" @click="handleSureadd(formRefadd)">保存</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 编辑按钮 dialog 弹窗 -->
    <el-dialog v-model="dialogVisible2" title="编辑角色">
        <el-form ref="formRef" :rules="rules" :model="form">
            <el-form-item label="链接标题" prop="name" status-icon label-width="80px">
                <el-input v-model="form.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancle">取消</el-button>
                <el-button type="primary" @click="handleSure(formRef)">保存</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 设置按钮的侧边栏 -->
    <el-drawer v-model="drawer2" :direction="direction">
        <template #title>
            <h3>设置菜单角色</h3>
        </template>
        <template #default>
            <el-tree :data="menulist" :default-expand-all="true" :default-checked-keys="menuarray" show-checkbox
                node-key="id" :props="defaultProps" />
        </template>
        <template #footer>
            <div>
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="confirmClick">确认</el-button>
            </div>
        </template>
    </el-drawer>

</template>

<script setup>
import { reactive, ref } from 'vue';
import Set from '@/api/set';
import Role from '@/api/role';
let rolelist = ref([]);

//加载角色列表
async function loadlist() {
    let { status, msg, data } = await Set.rolelist();
    // console.log(data);
    if (status) {
        rolelist.value = data;
    } else {
        //获取失败
        ElMessage.error(msg);
    }
}
loadlist();

//表单验证
const rules = reactive({
    name: [
        { required: true, message: '请输入角色名称！', trigger: 'blur' },
    ]
})

//添加按钮：
let formadd = ref({});
let dialogVisibleadd = ref(false);
//点击按钮，打开弹窗
function handleadd() {
    dialogVisibleadd.value = true;
}
//添加弹窗中的取消按钮
function handleCancleadd() {
    dialogVisibleadd.value = false;
}
let formRefadd = ref();
//添加弹窗中的保存按钮
let handleSureadd = (formEl) => {
    formEl.validate(async (valid) => {
        if (valid) {
            let { status, msg, data } = await Set.roleadd({ ...formadd.value });
            // console.log(status);
            console.log(formadd.value.name);
            console.log({ ...formadd.value });
            if (status) {
                rolelist.value.push({ ...formadd.value });
                //关闭窗口
                dialogVisibleadd.value = false;
                //重新获取，可以得到id
                loadlist();
                // 提示成功
                ElMessage.success('添加成功！');
            } else {
                // 提示错误
                ElMessage.error(msg);
            }
        }
    })
}

//编辑按钮：
let form = ref({});
let dialogVisible2 = ref(false);
let current = ref(0);
//点击事件，打开弹窗
let handleEdit = (data, i) => {
    // console.log(data);
    //记录打开的弹窗的索引
    current.value = i;
    //还原表单
    form.value = { ...data };
    dialogVisible2.value = true;
}
//编辑按钮弹窗中取消按钮
function handleCancle() {
    dialogVisible2.value = false;
}
let formRef = ref();
//编辑按钮弹窗中保存按钮
let handleSure = (formEl) => {
    formEl.validate(async (valid) => {
        if (valid) {
            let { status, msg, data } = await Set.roleedit(form.value.id);
            console.log(status);
            // console.log(form.value.id);
            if (status) {
                rolelist.value[current.value] = { ...form.value };
                //关闭窗口
                dialogVisible2.value = false;
                // 提示成功
                ElMessage.success(msg);
            } else {
                // 提示错误
                ElMessage.error(msg);
            }
        }
    })
}

//删除按钮：
let handleRemove = (id, i) => {
    ElMessageBox.confirm(
        '此操作将永久删除此用户，确认操作嘛?',
        {
            type: 'error',
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }
    )
        .then(async () => {
            let { status, msg } = await Set.roleremove(id, { ...form.value });
            // console.log(status);
            if (status) {
                //删除成功
                ElMessage.success(msg);
                rolelist.value.splice(i, 1);
            } else {
                //删除失败
                ElMessage.error(msg);
            }
        })
        .catch(() => {
            //取消按钮
            ElMessage('取消成功！');
        })
}

//设置按钮：
const drawer2 = ref(false);
const direction = ref('rtl');
const defaultProps = {
    children: 'children',
    label: 'name',
};
let menulist = ref([]);
let menuarray = ref([]);
let array1 = ref([]);
let Array = ref([]);
async function handleMenu(id) {
    drawer2.value = true;
    let { status, msg, data } = await Role.rolemenu({ id });
    // console.log(status, data, msg);
    if (status) {  //[{ id: 0, name: '全部分类', children: data }]
        menulist.value = [{ id: 0, name: '全部菜单', children: data }];
        // console.log(menulist.value);
        // console.log(menulist.value[0]);
        // console.log(menulist.value[0].children);
        Array.value = menulist.value[0].children;
        Array.value.forEach((item1) => {
            // console.log(item1.children);
            if (item1.children) {
                //有孩子元素
                let item2 = item1.children;
                for (var i = 0; i < item2.length; i++) {
                    item1.children[i].checked = true;
                }
                // item2.forEach((item) => {
                //     // console.log(item);
                //     // console.log(item.checked);
                //     item.checked = true;
                // });
                console.log(item2);
                // console.log(array1.value);
                menuarray.value.push(array1.value);
                // console.log(menuarray.value);
            }
            else {
                //没有孩子元素
                menuarray.value.push(item1);
            }
        })
    } else {
        console.log(msg);
    }
}
//打开侧边栏菜单后的取消按钮
function cancelClick() {
    drawer2.value = false;
}
//打开侧边栏菜单后的确认按钮
function confirmClick() {
    //发送axaj修改数据
    drawer2.value = false;
}

</script>


<style scoped>
.flex {
    display: flex;
    justify-content: space-between;
}
</style>