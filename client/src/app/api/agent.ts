import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

// this is the type of the response from the server
const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));

// this is the type of the error from the server
axios.defaults.baseURL = "http://localhost:5000/api/";

// this is the type of the response from the server
const responseBody = (response: AxiosResponse) => response.data;

//Error Handler
axios.interceptors.response.use(async res => {
    await sleep(0.5);
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
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

//Agent
const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`),
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
}

export default agent;
