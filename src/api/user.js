//用户
import axios from "axios";

//获取用户列表
let userlist = (params) => axios.get('/admins/list', { params });

//角色列表
let rolelist = (params) => axios.get('/role/list', { params });

//确认按钮
let sure = (data) => axios.put('/admins/account', data);

//删除按钮
let remove = (id, params) => axios.delete(`/admins/${id}`, { params });

export default {
    userlist,
    rolelist,
    sure,
    remove,
}