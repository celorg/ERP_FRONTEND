import { Card, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { Employee } from "src/models/Employee";
import { useAuth } from "src/utils/auth";
import { useRequest } from "src/utils/request";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

type Props = {
    employeesList: Employee[],
    resfreshList: () => void
}

const EmployeesTable = ( {employeesList, resfreshList}: Props ) => {

    const { handlePermissionExists } = useAuth();
    const { deleteEmployee } = useRequest();

    const navigate = useNavigate();

    const handleEditEmployee = (id: number) => {
        navigate(`/employees/edit/${id}`)
    }

    const handleDeleteEmployee = async (id: number) => {
        await deleteEmployee(id);

        resfreshList();
    }

    return (
        <Container maxWidth='lg' >
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    ID
                                </TableCell>
                                <TableCell>
                                    Nome
                                </TableCell>
                                <TableCell>
                                    Email
                                </TableCell>
                                <TableCell align="right">
                                    Ações
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeesList.map((employee) => (
                                <TableRow hover key={employee.id}>
                                    <TableCell>
                                        <Typography
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            #{employee.id}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {employee.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {employee.email}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="right">
                                        {handlePermissionExists('change_employee') && 
                                            <Tooltip title="Editar funcionário" arrow>
                                                <IconButton
                                                    color= 'primary'
                                                    
                                                    size="small"
                                                >
                                                    <EditTwoToneIcon onClick={() => handleEditEmployee(employee.id)} />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        {handlePermissionExists('delete_employee') && 
                                            <Tooltip title="Demitir funcionário" arrow>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                >
                                                    <DeleteTwoToneIcon onClick={() => handleDeleteEmployee(employee.id)} />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    )
}

export default EmployeesTable;
