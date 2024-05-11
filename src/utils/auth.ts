import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useRequest } from "./request";
import { setUser, setUserEnterprise } from "./redux/reducers/authReducer";
import { useState } from "react";
import { useNavigate } from "react-router";

const LOCAL_STORAGE_KEY = 'AUTH_ACCESS';

export const handleGetAccessToken = () => localStorage.getItem(LOCAL_STORAGE_KEY) ?? '';

export const useAuth = () => {

    const auth = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const navigate = useNavigate()

    const { signIn, getUser } = useRequest();

    const [isLogged, setIsLogged] = useState<Boolean>(auth.user != null)

    const user = {
        user: auth.user,
        enterprise: auth.enterprise
    }

    const logout = async() => {
        dispatch(setUser(null))
        dispatch(setUserEnterprise(null))
        setIsLogged(false)
        navigate('/signin')
        localStorage.removeItem(LOCAL_STORAGE_KEY)
    }

    const handleInitUser = async () => {
        const access_token = handleGetAccessToken();

        if(!access_token) return;

        const response = await getUser();

        if(response.status && response.status === 401){
            logout()
            return
        }

        if (!response.detail){
            dispatch(setUser(response.data.user))
            dispatch(setUserEnterprise(response.data.enterprise))
            setIsLogged(true)
            return
        }
    }

    const handlePermissionExists = (permissionCodename: string) => {
        if(auth.enterprise.is_owner) return true;

        return auth.enterprise.permissions.some(p => p.codename == permissionCodename);
    }

    const handleSignIn = async(email: string, password: string) => {
        const response = await signIn({email, password});

        if(!response.detail){
            dispatch(setUser(response.data.user));
            dispatch(setUserEnterprise(response.data.enterprise))
            setIsLogged(true)
            // save token access
            localStorage.setItem(LOCAL_STORAGE_KEY, response.data.access);
        }

        return response;
    }

    const handleSignOut = () => {
        logout()
    }

    return {
        user,
        isLogged,
        handleInitUser,
        handlePermissionExists,
        handleSignIn,
        handleSignOut,
        logout
    };
}