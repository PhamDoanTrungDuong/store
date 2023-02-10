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
    getColors: () => requests.get('products/get-colors'),
    getSizes: () => requests.get('products/get-sizes'),
    productVariants: (id: number) => requests.get(`products/product-variants/${id}`),
    variantsDetail: (id: number) => requests.get(`products/variants-details/${id}`),
    getProductDiscount: () => requests.get('discount'),
    addProductDiscount: (proudctId: number, percent: number) => requests.post(`discount?productId=${proudctId}&discount=${percent}`, {}),
    deleteProductDiscount: (productId: number) => requests.delete(`discount/${productId}`),
    productViewCount: (productId: number) => requests.post(`products/product-viewcount/${productId}`, {}),
    checkUserNotify: (id: number) => requests.post(`orders/userNotify/${id}`, {}),

}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1, color: string, size: string) => requests.post(`basket?productId=${productId}&quantity=${quantity}&color=${color}&size=${size}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    changePwd: (values: any) => requests.post('account/change-password', values),
    register: (values: any) => requests.post('account/register', values),
    googleAccount: (values: any) => requests.post('account/googleAccount', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress'),
    userAddresses: () => requests.get('account/get-addresses'),
    newAddress: (values: any) => requests.post('account/new-address', values),
    updateAddress: (values: any) => requests.post('account/update-address', values),
    deleteAddress: (id: number) => requests.delete(`account/delete-address/${id}`),
    memberTimerStop: () => requests.get('account/member-timer-stop'),
    getAllTime: () => requests.get('account/get-all-timer'),
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values),
    Momocreate: (data: any) => requests.get(`orders/momo-order?orderId=${data.orderId}&requestId=${data.requestId}&transId=${data.transId}&discount=${data.discount}`),
    Vnpaycreate: (voucherDiscount: number) => requests.get(`orders/vnpay-order?discount=${voucherDiscount}`),
    statusDelivery: (values: any) => requests.post('orders/delivery-status', values)
}

const Payments = {
    createPaymentIntent: () => requests.post('payments', {}),
    createNormalPayment: () => requests.post('payments/normal-payment', {}),
    confirmHashSecret: (vnp_SecureHash: any) => requests.post(`payments/confirm-hashsecret/${vnp_SecureHash}`, {}),
    refundIntent: (orderId: number) => requests.post(`payments/refund-intent/${orderId}`, {}),
    momoPayment: (voucherDiscount: number) => requests.post(`payments/Momo-payment?discount=${voucherDiscount}`, {}),
    vnpayPayment: (voucherDiscount: number) => requests.post(`payments/vnpay-payment?discount=${voucherDiscount}`, {}),
    momoQuery: (orderId: number) => requests.post(`payments/Momo-query?Id=${orderId}`, {}),
    momoRefund: (orderId: number) => requests.post(`payments/Momo-refund?Id=${orderId}`, {})
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
    getOrders: (params: URLSearchParams) => requests.get('admin/admin-get-orders', params),
    //Members
    getMembers: (params: URLSearchParams) => requests.get('account/all-members', params),
    deleteMember: (id: string) => requests.delete(`account/delete-member/${id}`),

    //Comments
    getComments: (params: URLSearchParams) => requests.get('comment/get-all-comments', params),
    deleteComment: (id: number) => requests.delete(`comment/${id}`),
    approveComment: (id: number) => requests.post(`comment/${id}`, {}),
    checkNotifyComment: (id: number) => requests.post(`comment/notify/${id}`, {}),

    //Categories
    getCategories: () => requests.get('category/get-category-client'),
    getAdminCategories: (params: URLSearchParams) => requests.get('category', params),
    createCategory: (name: string) => requests.post('category', name),
    deleteCategory: (id: number) => requests.delete(`category/${id}`),

    //Users
    lockUser: (id: string) => requests.post(`account/lock-user/${id}`, {}),
    unlockUser: (id: string) => requests.post(`account/unlock-user/${id}`, {}),

    //statistic
    statisticCurrentDay: (data: any) => requests.get(`admin/statistic-dmy?d=${data.d}&m=${data.m}&y=${data.y}`),
    statisticToday: () => requests.get(`admin/statistic-current-day`),
    statisticPerYear: (data: any) => requests.get(`admin/statistic-selected-year?year=${data.y}`),
    orderDeliveryState: () => requests.get(`admin/order-delivery-state`),
    bestSeller: () => requests.get(`admin/best-seller`),
    lessInteraction: () => requests.get(`admin/less-interaction`),
    returnPurchaseRate: () => requests.get(`admin/return-purchase-rate`),

    //sliders
    getSliders: () => requests.get('admin/get-sliders'),
    newSlider: (slider: any) => requests.postForm('admin/add-slider', createFormData(slider)),
    updateSlider: (slider: any) => requests.putForm('admin/update-slider', createFormData(slider)),
    deleteSlider: (id: number) => requests.delete(`admin/delete-slider/${id}`),

    //partners
    getPartners: () => requests.get('admin/get-partners'),
    newPartner: (partner: any) => requests.postForm('admin/add-partner', createFormData(partner)),
    updatePartner: (partner: any) => requests.putForm('admin/update-partner', createFormData(partner)),
    deletePartner: (id: number) => requests.delete(`admin/delete-partner/${id}`),

    //discountBanners
    getDiscountBanner: () => requests.get('admin/get-discountBanners'),
    newDiscountBanner: (discountBanner: any) => requests.postForm('admin/add-discountBanner', createFormData(discountBanner)),
    updateDiscountBanner: (discountBanner: any) => requests.putForm('admin/update-discountBanner', createFormData(discountBanner)),
    deleteDiscountBanner: (id: number) => requests.delete(`admin/delete-discountBanner/${id}`),

     //vouchers
     getVouchers: () => requests.get('admin/get-vouchers'),
     newVoucher: (voucher: any) => requests.postForm('admin/add-voucher', createFormData(voucher)),
     updateVoucher: (voucher: any) => requests.putForm('admin/update-voucher', createFormData(voucher)),
     deleteVoucher: (id: number) => requests.delete(`admin/delete-voucher/${id}`),

     //Admin Notify
     getAdminNotify: () => requests.get('admin/admin-notifies'),
     adminCheckNotify: (data: string) => requests.post(`admin/admin-check-notify/${data}`, {}),

}

const Profile = {
    updateProfile: (profile: any) => requests.putForm('account', createFormData(profile)),
}

const Comment = {
    getComment: (id: number) => requests.get(`comment?productId=${id}`),
    getRatings: (id: number) => requests.get(`comment/get-ratings?productId=${id}`),
    customerSatisfaction: () => requests.get('comment/customer-satisfaction'),
    postComment: (content: string) => requests.post('comment', content),
}

const Like = {
    addLike: (id: number) => requests.post(`likes?productId=${id}`, {}),
    getAllLike: () => requests.get('likes/get-all-like'),
    getCurrentLike: () => requests.get('likes/get-current-like'),
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
    Like,
}

export default agent;
