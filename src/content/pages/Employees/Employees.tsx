import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import EmployeesTable from "src/components/EmployessTable";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { PermissionMiddleware } from "src/middlewares/PermissionMiddlewares";
import { Employee } from "src/models/Employee";
import { useRequest } from "src/utils/request";


const Employees = () => {

    const [requestLoading, setRequestLoading] = useState(true);
    const [employeesData, setEmployeesData] = useState<Employee[]>([]);

    const { getEmployees } = useRequest();

    const handleGetEmployees = async() => {
        const response = await getEmployees();

        if(!response.detail){
            setEmployeesData(response.data.employees);
        }

        setRequestLoading(false);
    }

    useEffect(() => {
        handleGetEmployees();
    }, []);

    return (
        <PermissionMiddleware codeName="view_employee">
            <Helmet>
                <title>Funcionários</title>
            </Helmet>

            <PageTitleWrapper>
                <PageTitle 
                    heading="Funcionários"
                    subHeading="Consulte os funcionários da empresa e execute ações em cada funcionário"
                />
            </PageTitleWrapper>

            <Container maxWidth="xl" sx={{
                marginX: requestLoading ? '-10%' : 0, 
                transition: 'all .5s'
            }}>
                <EmployeesTable 
                    employeesList={employeesData}
                    resfreshList={handleGetEmployees}
                />

            </Container>
        </PermissionMiddleware>
    )

}

export default Employees;