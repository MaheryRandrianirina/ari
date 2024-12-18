import axios, { AxiosRequestConfig } from "axios"

const apiOptions = {
    withCredentials:true
}

const get = async(route:string, token: string|null)=>{
    return await axios.get(`http://localhost:3000/${route}`, {...apiOptions, headers: {authorization: token}});
}

const post = async(route:string, data: {[name:string]: string|number|null},token: string|null, config?: AxiosRequestConfig)=>{
    return await axios.post(`http://localhost:3000/${route}`, data, config ? {...apiOptions, ...config, headers: {authorization: token}} : apiOptions);
}

const put = async(route:string, data: {[name:string]: string|number}, token: string|null)=>{
    return await axios.put(`http://localhost:3000/${route}`, data, {...apiOptions, headers: {authorization: token}});
}

const Delete = async(route:string, token: string|null)=>{
    return await axios.delete(`http://localhost:3000/${route}`, {...apiOptions, headers: {authorization: token}});
}

export {
    get,
    post,
    put,
    Delete
}