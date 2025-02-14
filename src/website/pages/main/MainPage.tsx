import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Layout } from './Layout';

export default function MainPage() {
    const { user } = useSelector((state: RootState) => state.user);
    if (!user) {
        return <Navigate to="/login" />;
    }
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}
