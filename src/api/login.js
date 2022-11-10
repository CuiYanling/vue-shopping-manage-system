import axios from "axios";

//登录
let login = (data) => axios.post('/admins/login', data);


export default {
    login,
}