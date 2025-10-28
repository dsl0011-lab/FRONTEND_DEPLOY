import Dashboard from '../Dashboard/Dashboard';
import PrivateRoute from '../Authorization/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import ProfileCard from '../Dashboard/ProfileCard';
import Asignaturas from '../Dashboard/Asignaturas';

function AppContent() {

    return (
        <>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path='/*' element={<Dashboard />}>
                        <Route path='perfil' element={<ProfileCard />} />
                        <Route path='asignaturas' element={<Asignaturas />} />
                    </Route>
                </Route>
            </Routes>
        </>
    )
}
export default AppContent;
