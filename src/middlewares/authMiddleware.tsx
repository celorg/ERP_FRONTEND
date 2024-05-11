import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router"
import { handleGetAccessToken, useAuth } from "src/utils/auth"
import { useRequest } from "src/utils/request"

type Props = {
    children: ReactNode,
}

export const AuthMiddleware = ({children}: Props) => {

    const navigate = useNavigate();

    const { getUser } = useRequest();


    const handleLogged = async () => {

        const access_token = handleGetAccessToken();

        if(!access_token) {
            navigate('/signin');
            return;
        };

        const response = await getUser();

        if(response.detail){
            console.log('vai poha')
            navigate('/signin');
            return;
        }

    }

    useEffect(() => {
        handleLogged()
    }, [])

    // const user = useSelector((state: RootState) => state.auth.user);

    // const { isLogged } = useAuth()

    // if(!user){
    //     navigate('/signin')
    // }

    // useEffect(() => {
    //     if(!isLogged) {
            
    //         console.log('teste')
    //         navigate('/signin')
    //     }
    // }, [isLogged])

    return (
        <>
            {children}
        </>
    )
}