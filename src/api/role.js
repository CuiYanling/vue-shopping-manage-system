import axios from 'axios';

//根据id获取侧边栏菜单
let menu = (params) => axios.get('role/menu/', { params });

//根据角色获取侧边栏菜单
let rolemenu = (params) => axios.get('/role/config', { params });

export default {
    menu,
    rolemenu,
}