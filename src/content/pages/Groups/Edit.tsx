import { Button, Container, LinearProgress, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PermissionsList from "src/components/PermissionList";
import { PermissionMiddleware } from "src/middlewares/PermissionMiddlewares"
import { PermissionDetail } from "src/models/Permission";
import { useRequest } from "src/utils/request";


const EditGroup = () => {

    const [requestLoading, setRequestLoading] = useState(true);
    const [infoMessage, setInfoMassege] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [permissionsData, setPermissionsData] = useState<PermissionDetail[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    const { id: group_id } = useParams();

    const { getPermissions, getAnGroup, editGroup } = useRequest();

    const navigate = useNavigate();

    const handleGetPermissions = async() => {
        const response = await getPermissions();

        if (!response.detail){
            setPermissionsData(response.data.permissions)
        }
    }

    const handleGetGroup = async() => {
        const response = await getAnGroup(+group_id);

        if(!response.detail){
            setNameInput(response.data.group.name);
            setSelectedPermissions(response.data.group.permissions.map(item => item.id));
        }
    }


    const handleEdit = async () => {
        const name = nameInput;
        const permissions = selectedPermissions.join(',');

        if(!name){
            setInfoMassege('Preencha todos os campos')
            return;
        }

        setRequestLoading(true);
        const response = await editGroup(+group_id, {name, permissions});
        setRequestLoading(false);

        if (response.detail){
            setInfoMassege(response.detail);
        }else{
            navigate('/groups');
        }
    }

    useEffect(() => {
        Promise.resolve([handleGetPermissions(), handleGetGroup()]).finally(() => {
            setRequestLoading(false);
        });
    }, [])

    return (
        <PermissionMiddleware codeName="change_group">
            <Helmet>
                <title>Editar um cargo</title>
            </Helmet>
            {requestLoading && <LinearProgress sx={{height: 2}} color="primary" />}

            <PageTitleWrapper>
                <PageTitle
                    heading="Editar Cargo"
                    subHeading="Edite um cargo e configure"
                ></PageTitle>
            </PageTitleWrapper>

            <Snackbar 
                open={infoMessage != ''}
                onClose={() => setInfoMassege('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                message={infoMessage}
            />

            <Container maxWidth="lg" sx={{ pb: 5}}>
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
                        sx={{width: 90, mt: 3, mb: 5}}
                        onClick={requestLoading ? () => null : handleEdit}
                        disabled={requestLoading}
                    >
                        Editar
                    </Button>
                </Stack>
            </Container>
        </PermissionMiddleware>
    )
}

export default EditGroup;
