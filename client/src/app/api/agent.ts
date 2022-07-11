import { PaginationResponse } from './../interfaces/IPagination';
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { store } from '../store/configureStore';

// this is the type of the response from the server
const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));

// this is the type of the error from the server
axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

// this is the type of the response from the server
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config: any) => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config
}) 

//Error Handler
axios.interceptors.response.use(async res => {
    await sleep(0.5);
    const pagination = res.headers['pagination'];
    if(pagination){
        res.data = new PaginationResponse(res.data, JSON.parse(pagination));
        return res;
    }
    return res;
}, (error: AxiosError) => {
    const {data, status}: any = error.response;
    switch (status) {
        case 400:
            if(data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key].join(" "));
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 404:
            history.push("/not-found");
            toast.error(data.title);
            break;
        case 500:
            toast.error(data.title);
            break;
    }
    return Promise.reject(error.response);
})

//Request Handler
const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

//Agent
const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilter: () => requests.get('products/filters'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress')
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values)
}

const TestError = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}


const agent = {
    Catalog,
    TestError,
    Basket,
    Account,
    Orders,
}

export default agent;
