import { PaginationResponse } from './../interfaces/IPagination';
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { store } from '../store/configureStore';
import Swal from 'sweetalert2';

// this is the type of the response from the server
const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 300));

// this is the type of the error from the server
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
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
    if(process.env.NODE_ENV === 'development') await sleep(0.5);
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
            Swal.fire({
                icon: "warning",
                title: data.title,
                showConfirmButton: false,
                timer: 1500,
            });
            break;
        case 401:
            Swal.fire({
                icon: "error",
                title: data.title,
                showConfirmButton: false,
                timer: 1500,
            });
            break;
        case 403:
            Swal.fire({
                icon: "error",
                title: data.title,
                showConfirmButton: false,
                timer: 1500,
            });
            break;
        case 404:
            history.push("/not-found");
            toast.error(data.title);
            break;
        case 500:
            Swal.fire({
                icon: "error",
                title: data.title,
                showConfirmButton: false,
                timer: 1500,
            });
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
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody),
    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody)
}

//Agent
const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilter: () => requests.get('products/filters'),
    getProductCount: () => requests.get('products/get-product-count'),
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
    create: (values: any) => requests.post('orders', values),
    Momocreate: () => requests.get('orders/momo-order'),
    statusDelivery: (values: any) => requests.post('orders/delivery-status', values)
}

const Payments = {
    createPaymentIntent: () => requests.post('payments', {}),
    momoPayment: () => requests.post('payments/Momo-payment', {})
}

function createFormData(item: any) {
    let formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key]);
    }
    return formData;
}

const Admin = {
    createProduct: (product: any) => requests.postForm('products', createFormData(product)),
    updateProduct: (product: any) => requests.putForm('products', createFormData(product)),
    deleteProduct: (id: number) => requests.delete(`products/${id}`),
    getUserRole: () => requests.get('admin/user-with-roles'),
    editRole: (username: string, roles: string[]) => axios.post(`admin/edit-roles/${username}?roles=${roles}`),
    getOrder: () => requests.get('admin/admin-get-orders'),
    getMembers: (params: URLSearchParams) => requests.get('account/all-members', params),
    deleteMember: (id: string) => requests.delete(`account/delete-member/${id}`),
    getComments: () => requests.get('comment/get-all-comments'),
    deleteComment: (id: number) => requests.delete(`comment/${id}`),
    getCategories: () => requests.get('category'),
    createCategory: (name: string) => requests.post('category', name),
    deleteCategory: (id: number) => requests.delete(`category/${id}`),

}

const Profile = {
    updateProfile: (profile: any) => requests.putForm('account', createFormData(profile)),
}

const Comment = {
    getComment: (id: number) => requests.get(`comment?productId=${id}`),
    getRatings: (id: number) => requests.get(`comment/get-ratings?productId=${id}`),
    postComment: (content: string) => requests.post('comment', content),
}

const Statistisc = {
    getTotal: () => requests.get('orders/get-total-order'),
    getAllTotal: () => requests.get('orders/getAll-total-order'),
    getMemberCount: () => requests.get('account/get-member-count'),
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
    Payments,
    Admin,
    Comment,
    Profile,
    Statistisc,
}

export default agent;
