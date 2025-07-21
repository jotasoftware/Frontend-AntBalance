import { useAuth } from '@/context/AuthContext';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import Loading from '@/components/common/loading/Loading';
import LoginPage from '@/pages/common/LoginPage/LoginPage';
import RecoverPage from '@/pages/common/RecoverPage/RecoverPage';
import EditarCadastroPage from '@/pages/common/EditarCadastroPage/EditarCadastroPage';
import ConfigPage from '@/pages/common/ConfigPage/ConfigPage';
import GastosPage from '@/pages/user/GastosPage/GastosPage';
import Private from '@/components/common/private/Private';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import DashboardPage from '@/pages/user/DashboardPage/DashboardPage';
import CadastroGastoPage from '@/pages/user/CadastroGastoPage/CadastroGastoPage';
import CadastroGastoCompanyPage from '@/pages/company/CadastroGastoCompanyPage/CadastroGastoCompanyPage';
import GastosInativosPage from '@/pages/user/GastosInativosPage/GastosInativosPage';
import CategoriasPage from '@/pages/user/CategoriasPage/CategoriasPage';
import CadastroFuncionarioPage from '@/pages/company/CadastroFuncionarioPage/CadastroFuncionarioPage';
import FuncionariosPage from '@/pages/company/FuncionariosPage/FuncionariosPage';
import FuncionariosInativosPage from '@/pages/company/FuncionariosInativosPage/FuncionariosInativosPage';
import DashboardPageCompany from '@/pages/company/DashboardPageCompany/DashboardPageCompany';

export default function PrivateRoutes() {
    const { userRole, loadingAuth } = useAuth();

    // if (loadingAuth) return <Loading />;

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<RecoverPage />} />
            <Route
            path="/"
            element={
                <Private>
                    <MainLayout />
                </Private>
            }
            >
                {userRole === 'PESSOAL' ? (
                    <>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="gastos" element={<GastosPage />} />
                        <Route path="cadastrogasto" element={<CadastroGastoPage />} />
                        <Route path="categorias" element={<CategoriasPage />} />
                    </>
                ) : (
                    <>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPageCompany />} />
                        <Route path="gastos" element={<GastosPage />} />
                        <Route path="cadastrogasto" element={<CadastroGastoCompanyPage />} />
                        <Route path="cadastrofuncionario" element={< CadastroFuncionarioPage/>} />
                        <Route path="funcionarios" element={< FuncionariosPage/>} />
                        <Route path="funcionariosinativos" element={< FuncionariosInativosPage/>} />
                    </>)}
                <Route path="gastosinativos" element={<GastosInativosPage />} />
                <Route path="editarcadastro" element={<EditarCadastroPage />} />
                <Route path="config" element={<ConfigPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
