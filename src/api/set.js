import axios from "axios";

//角色列表
let rolelist = (params) => axios.get('/role/list', { params });
//角色添加按钮
let roleadd = (data) => axios.post('/role', data);
//角色编辑按钮
let roleedit = (id, data) => axios.put(`/role/${id}`, data);
//角色删除按钮
let roleremove = (id, params) => axios.delete(`/role/${id}`, { params });

//菜单权限
let menu = (params) => axios.get('/menu/all', { params });
//编辑（更新）菜单
let menuedit = (id, data) => axios.put(`/menu/${id}`, data);
// 添加菜单
let menuadd = (data) => axios.post('/menu', data);
// 删除菜单
let menudelete = (id, params) => axios.delete(`/menu/${id}`, { params });


export default {
    rolelist,
    roleadd,
    roleedit,
    roleremove,

    menu,
    menuedit,
    menuadd,
    menudelete,
}