import axios, { AxiosRequestConfig } from "axios"

const apiOptions = {
    headers: {
      authorization: localStorage.getItem("bearer-token")
    },
    withCredentials:true
}

const get = async(route:string)=>{
    return await axios.get(`http://localhost:3000/${route}`, apiOptions);
}

const post = async(route:string, data: {[name:string]: string|number|null}, config?: AxiosRequestConfig)=>{
    return await axios.post(`http://localhost:3000/${route}`, data, config ? {...apiOptions, ...config} : apiOptions);
}

const put = async(route:string, data: {[name:string]: string|number})=>{
    return await axios.put(`http://localhost:3000/${route}`, data, apiOptions);
}

const Delete = async(route:string)=>{
    return await axios.delete(`http://localhost:3000/${route}`, apiOptions);
}

export {
    get,
    post,
    put,
    Delete
}