import Dashboard from '../Dashboard/Dashboard';
import PrivateRoute from '../Authorization/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import ProfileCard from '../Dashboard/ProfileCard';
import Inicio from '../Dashboard/Inicio';

function AppContent() {

    return (
        <>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path='/*' element={<Dashboard />}>
                        {/* <Route path='Inicio' element={<Inicio />} /> */}
                        <Route path='perfil' element={<ProfileCard />} />
                    </Route>
                </Route>
            </Routes>
        </>
    )
}
export default AppContent;
