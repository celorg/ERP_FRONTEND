import { Button, Container, LinearProgress, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PermissionsList from "src/components/PermissionList";
import { PermissionMiddleware } from "src/middlewares/PermissionMiddlewares"
import { PermissionDetail } from "src/models/Permission";
import { useRequest } from "src/utils/request";


const AddGroupPermissions = () => {

    const { getPermissions, addGroup } = useRequest();

    const navigate = useNavigate();

    const [requestLoading, setRequestLoading] = useState(true);
    const [infoMessage, setInfoMassege] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [permissionsData, setPermissionsData] = useState<PermissionDetail[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

    const handleGetPermissions = async() => {
        const response = await getPermissions();

        if (!response.detail){
            setPermissionsData(response.data.permissions)
        }
    }

    useEffect(() => {
        Promise.resolve(handleGetPermissions()).finally(() => {
            setRequestLoading(false);
        });
    }, [])

    const handleAdd = async () => {
        const name = nameInput;
        const permissions = selectedPermissions.join(',');

        if(!name){
            setInfoMassege('Preencha todos os campos')
            return;
        }

        setRequestLoading(true);
        const response = await addGroup({name, permissions});
        setRequestLoading(false);

        if (response.detail){
            setInfoMassege(response.detail);
        }else{
            navigate('/groups');
        }
    }

    return (
        <PermissionMiddleware codeName="add_group">
            <Helmet>
                <title>Adicionar um cargo</title>
            </Helmet>
            {requestLoading && <LinearProgress sx={{height: 2}} color="primary" />}

            <PageTitleWrapper>
                <PageTitle
                    heading="Adicionar um Cargo"
                    subHeading="Adicione um cargo e defina, permissões e etc"
                ></PageTitle>
            </PageTitleWrapper>

            <Snackbar 
                open={infoMessage != ''}
                onClose={() => setInfoMassege('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                message={infoMessage}
            />

            <Container maxWidth="lg">
                <Stack maxWidth={700} spacing={3}>
                    <TextField 
                        fullWidth
                        label="Nome *"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                    />
                    <PermissionsList 
                        permissionsData={permissionsData}
                        selectedPermissions={selectedPermissions}
                        setSelectedPermissions={setSelectedPermissions}
                    />
                    <Button 
                        variant="outlined"
                        sx={{width: 90, mt: 3}}
                        onClick={requestLoading ? () => null : handleAdd}
                        disabled={requestLoading}
                    >
                        Adicionar
                    </Button>
                </Stack>
            </Container>
        </PermissionMiddleware>
    )
}

export default AddGroupPermissions;
