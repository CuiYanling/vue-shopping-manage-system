<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>账户信息</span>
            </div>
        </template>
        <el-form :rules="rules" ref="formRef" :model="form" label-width="120px" center>
            <el-form-item label="账户" >
                <el-input v-model="form.username" disabled/>
            </el-form-item>
            <el-form-item label="姓名" prop="fullname">
                <el-input v-model="form.fullname" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="form.sex">
                    <el-radio label="男" />
                    <el-radio label="女" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机" prop="tel">
                <el-input v-model="form.tel" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-upload class="avatar-uploader" :action="`${host}/upload/common/`" :headers="headers" :data="extra"
                    :show-file-list="false" accept=".png,.jpg,.jpeg" :on-success="handleUploadSuccess"
                    :on-error="handleUploadError" :before-upload="handlebeforeUpload">
                    <img style="width:120px" v-if="form.avatar" :src="form.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <template #default="scope">
                    <el-button @click="handleKeep(formRef)" type="primary">修改</el-button>
                </template>
            </el-form-item>
        </el-form>
    </el-card>
</template>
  
<script setup>
import { ref, reactive } from 'vue';
import { useAccountStore } from '@/stores/account';
import { inject } from 'vue';

//依赖注入（环境变量）
let host = inject('host');
// console.log(inject('host'));

let form = ref({
    id: '',
    fullname: '',
    sex: '男',
    role_name: '',
    tel: '',
    avatar: ''
})

//头像：
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
        form.value.avatar = src;
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

//表单验证规则
const rules = reactive({

    fullname: [
        { required: true, message: '请输入姓名！', trigger: 'blur' },
        // { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名长度要求2-5个字符！', trigger: 'blur' }
    ],
    sex: [
        { required: true, message: '请至少选择一个性别！', trigger: 'blur' },
    ],
    role_name: [
        { required: true, message: '请至少选择一个角色！', trigger: 'blur' },
    ],
    tel: [
        { required: true, message: '请输入手机号码！', trigger: 'blur' },
        {
            pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
            , message: '请输入正确的手机号码！', trigger: 'blur'
        }
    ],
    avatar: [
        { required: true, message: '请添加头像！', trigger: 'blur' },
    ],
})

//初始化store
let account = useAccountStore();

//浅拷贝，还原表单
form.value = { ...account.profile }
// console.log(form.value);

//获取router实例对象
//获取form组件实例---校验登录
const formRef = ref();
//保存修改
//保存按钮——校验
function handleKeep(formEl) {
    formEl.validate(async (valid, fields) => {
        //校验成功
        if (valid) {
            //调用action
            account.updateProfile(form.value);
            // console.log(form.value)
        }
    })
}

</script>


<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
  