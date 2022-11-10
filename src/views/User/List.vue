<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>用户列表</span>
            </div>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="#" />
            <el-table-column label="头像" prop="avatar" sortable>
                <template #default="scope">
                    <el-avatar shape="square" :src="scope.row.avatar" />
                </template>
            </el-table-column>
            <el-table-column prop="username" label="账号" sortable />
            <el-table-column prop="fullname" label="姓名" sortable />
            <el-table-column prop="sex" label="性别" sortable />
            <el-table-column prop="tel" label="手机" sortable />
            <el-table-column prop="role_name" label="角色" sortable>
                <template #default="scope">
                    <el-tag :type="[scope.row.username === 'admin' ?'danger':'']">
                        {{scope.row.role_name }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="login_time" label="上次登录" sortable />
            <el-table-column prop="logini_count" label="登录次数" sortable />
            <el-table-column prop="operation" label="操作" #default="scope">
                <el-space>
                    <el-link>
                        <el-button type="primary" plain @click="handleEdit(scope.row,scope.$index)">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                        </el-button>
                    </el-link>
                    <el-button type="danger" plain @click="handleRemove(scope.row.id,scope.$index)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </el-space>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 编辑按钮 弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="40%">
        <el-form ref="formRef" :rules="rules" :model="idform">
            <el-form-item prop="fullname" label="姓名" status-icon label-width="50px">
                <el-input v-model="idform.fullname" />
            </el-form-item>
            <el-form-item prop="sex" label="性别" label-width="50px">
                <el-radio-group v-model="idform.sex">
                    <el-radio label="男" />
                    <el-radio label="女" />
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="tel" label="手机" status-icon label-width="50px">
                <el-input v-model="idform.tel" />
            </el-form-item>
            <el-form-item prop="role_name" label="角色" status-icon label-width="50px">
                <el-select v-model="idform.role_name" class="m-2" placeholder="Select">
                    <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="头像" prop="avatar" label-width="50px">
                <el-upload class="avatar-uploader" :action="`${host}/upload/common/`" :headers="headers" :data="extra"
                    :show-file-list="false" accept=".png,.jpg,.jpeg" :on-success="handleUploadSuccess"
                    :on-error="handleUploadError" :before-upload="handlebeforeUpload">
                    <img style="width:100px" v-if="idform.avatar" :src="idform.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSure(formRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import User from '@/api/user';
import { inject } from 'vue';

//依赖注入（环境变量）
let host = inject('host');
// console.log(inject('host'));

let tableData = ref([]);

//加载管理员列表的函数：
//方法：onMounted（没有参数的话，就使用onMounted方法）【有参数---watchEffect】
onMounted(async () => {
    let { status, msg, data } = await User.userlist();
    if (status) {
        //获取到数据，渲染数据
        tableData.value = data;
        // console.log(data);
    } else {
        //获取失败
        ElMessage.error(msg);
    }
})

//获取角色列表数据：
let roleList = ref([]);
onMounted(async () => {
    let { status, msg, data } = await User.rolelist();
    if (status) {
        //获取到数据，渲染数据
        console.log(data);
        roleList.value = data;
        // console.log(data);
    } else {
        //获取失败
        ElMessage.error(msg);
    }
})

//编辑按钮：
let current = ref();
let dialogVisible = ref(false);
let idform = ref([]);
function handleEdit(data, i) {
    //还原弹窗内容
    idform.value = data;
    //打开弹窗
    dialogVisible.value = true;
    current.value = i;
}
// //编辑头像
//提取token
let token = sessionStorage.token;
let headers = { Authorization: `Bearer ${token}` };
//附加参数：
let extra = { type: 'avatar' };
//上传之前的检查：
const handlebeforeUpload = (rawFile) => {
    //判断图片格式/^image\/(jpeg|png|jpg)$/
    let isValid = /^image\/(jpeg|png|jpg)$/.test(rawFile.type);
    if (!isValid) {
        ElMessage.error('头像必须是JPG/PNG/JPEG格式!');
        //return false 为了取消上传文件
        return false;
        //判断图片体积（大于2MB）
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像体积不允许超过2MB!');
        return false;
    }
    return true;
}
//上传成功
const handleUploadSuccess = ({ status, msg, src }, uploadFile) => {
    // console.log(status, msg, uploadFile);
    if (status) {
        //上传成功
        //生成图片地址
        idform.value.avatar = src;
        ElMessage.success(msg);
    } else {
        //上传失败
        ElMessage.error(msg);
    }
}
//上传失败
const handleUploadError = (error, uploadFile) => {
    // console.log(error);
    //将json对象 转换 为对象并解析出来
    let { status, msg } = JSON.parse(error.message);
    //错误通知
    ElMessage.error(msg);
}

//校验表单
//获取form组件实例---校验登录
let formRef = ref();
const rules = reactive({
    fullname: [
        { required: true, message: '请输入用户名!', trigger: 'blur' },
        { min: 1, max: 10, message: '用户名要求在一个字到10个字之间', trigger: 'blur' }
    ],
    sex: [
        { required: true, trigger: 'blur' },
    ],
    tel: [
        { required: true, message: '请输入手机号码!', trigger: 'blur' },
    ],
    role_name: [
        { required: true, trigger: 'blur' },
    ],
    avatar: [
        { required: true, trigger: 'blur' },
    ]
})
//弹窗中确认按钮
let handleSure = (formEl) => {
    //表单验证
    formEl.validate(async (valid) => {
        if (valid) {
            let { status, msg } = await User.sure({ ...idform.value });
            if (status) {
                //操作DOM
                // console.log({ ...idform.value });
                idform.value[current.value] = { ...idform.value };
                //关闭窗口
                dialogVisible.value = false;
                // 提示成功
                ElMessage.success(msg);
                console.log(msg);
            } else {
                // 提示错误
                ElMessage.error(msg);
            }
        }
    })
}

//删除按钮：
function handleRemove(id, i) {
    //弹出确认删除框---confirm(传三个参数，用不到的可以不传)
    ElMessageBox.confirm(
        '此操作将彻底删除此账户，确认继续嘛?',
        {
            type: 'error',
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }
    )
        .then(async () => {
            //确认按钮——1：发送ajax给后台—---2：等ajax成功后再删除DOM【不传id的话，后台报错500】
            //1:
            let { status, msg } = await User.remove(id);  // id: id  简化为  id
            console.log(status);
            console.log(msg);
            if (status) {
                //删除成功
                ElMessage.success(msg);
                //2:
                tableData.value.splice(i, 1);
            } else {
                //删除失败
                ElMessage.error('删除失败');
            }
        })
        .catch(() => {
            //取消按钮
            ElMessage('取消成功！');
        })
}

</script>