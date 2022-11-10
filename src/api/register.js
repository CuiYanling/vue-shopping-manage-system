import axios from "axios";

//登录
let register = (data) => axios.post('/admins/register', data);


export default {
    register,
}