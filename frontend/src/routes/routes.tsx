import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hompage from '../pages/homepage'
import Login from '../pages/login'
import Register from '../pages/register'
import EmailLink from '@/pages/emailLink';
import ProtectedRoute from './protectedRoutes';
import { AuthContext } from '@/context/authContext';
import { useContext } from 'react';

function MyRoutes() {
  const { loading } = useContext(AuthContext);

  return (
    <>
      {loading ? (
        <div className='bg-gray-500 w-full h-full'/>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path='/' element={<Hompage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/emailLink' element={<EmailLink />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default MyRoutes;