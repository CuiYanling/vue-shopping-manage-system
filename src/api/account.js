import axios from 'axios';

//获取管理员信息
let info = (params) => axios.get('/admins', { params })

//保存
let save = (data) => axios.post('/admin/info', data)

//修改本账户信息
let edit = (data) => axios.put('/admins/account', data)


export default {
    info,
    save,
    edit,
}