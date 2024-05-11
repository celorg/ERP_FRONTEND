import axios, { AxiosError } from "axios"
import { ApiError } from "src/models/Api"
import { handleGetAccessToken, useAuth } from "./auth"


const BASE_URL = 'http://localhost:8000/api/v1'

const LOCAL_STORAGE_KEY = 'AUTH_ACCESS';

export const useApi = async <TypeDataResponse>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: object,
    withAuth: boolean = true
): Promise<{
    data?: TypeDataResponse,
    detail: string,
    status?: number
}> => {


    // Lógica de autenticação
    const access_token = handleGetAccessToken();

    let headers = {};
    if (withAuth && access_token) {
        headers['Authorization'] = `Bearer ${access_token}`
    }


    try {
        const request = await axios(`${BASE_URL}/${endpoint}`, {
            method,
            data: method != 'GET' && data,
            params: method == 'GET' && data,
            headers
        })
    
        return {
            data: request.data,
            detail: '',
        }
    } catch (e) {
        const error = e as AxiosError<ApiError>;

        if (error.response.status === 401) {
            localStorage.removeItem(LOCAL_STORAGE_KEY)
            window.location.reload();
        }

        return {
            data: null,
            detail: error.response.data.detail || error.message,
            status: error.response.status
        }
    }

}

