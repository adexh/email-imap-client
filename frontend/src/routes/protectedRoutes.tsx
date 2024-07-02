import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/authContext';

const ProtectedRoute: React.FC = () => {
  const { authenticated, loading, isLinked } = useContext(AuthContext);

  const location = useLocation().pathname;
  console.log("Auth protected Route : ",authenticated);

  if( loading ) {
    console.log("Is loading");
    
    return <Outlet/>
  }
  
  if( authenticated && (location === '/login' || location === '/register' ) ) {
    console.log("Auth and path  ", location);

    return isLinked?<Navigate to='/' />:<Navigate to='/emailLink' />
  }

  if( !authenticated && location !== '/login' && location !== '/register' ) {
    return <Navigate to="/login" state={{ from: location }}/>;
  }

  return <Outlet/>
};

export default ProtectedRoute;