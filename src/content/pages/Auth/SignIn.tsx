import styled from "@emotion/styled";
import { Box, Button, Card, Container, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async"

import MuiAlert from '@mui/material/Alert';
import { handleGetAccessToken, useAuth } from "src/utils/auth";
import { useNavigate } from "react-router";

const MainContent = styled(Box)(() => `
    height: 100%;
    display: flex;
    flex: 1;
    onverflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`)

const SignIn = () => {

    const navigate = useNavigate()

    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const { handleSignIn } = useAuth();

    useEffect(() => {
        const token = handleGetAccessToken()

        if(token){
            navigate('/')
        }
    }, [])

    const handleSignInBtn = async() => {
        if (emailInput == '' || passwordInput == ''){
            setSnackBarMessage('Preencha todos os campos')
        }

        const request = await handleSignIn(emailInput, passwordInput);

        if(request.detail){
            setSnackBarMessage('Email e/ou senha(s) incorreto(s)')
            return
        }

        navigate('/');
    }

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>

            <Snackbar 
                open={snackBarMessage != ''}
                autoHideDuration={6000}
                onClose={() => setSnackBarMessage('')}
            >
                <MuiAlert style={{color: 'whitesmoke'}} severity="error" >{snackBarMessage}</MuiAlert>
            </Snackbar>

            <MainContent>
                <Container maxWidth="sm">
                    <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                        <Stack mb={5}>
                            <TextField 
                                label="Email"
                                type="email"
                                value={emailInput}
                                onChange={e => setEmailInput(e.target.value)}
                            />
                        </Stack>
                        <Stack spacing={3}>
                            <TextField 
                                label="Senha"
                                type="password"
                                value={passwordInput}
                                onChange={e => setPasswordInput(e.target.value)}
                            />
                        </Stack>
                        <Button
                            onClick={handleSignInBtn}
                            variant="outlined"
                            style={{ marginTop: 40, width: '100%' }}
                        >
                            Entrar
                        </Button>
                    </Card>
                    
                </Container>
            </MainContent>
        </>
    )
}

export default SignIn;
