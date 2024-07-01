import { createContext, ReactNode, useMemo, useState, useEffect } from 'react'
import axios from 'axios';

type Props = {
  children?: ReactNode;
}

type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void
  loading: boolean;
  setLoading: (newState: boolean) => void
}

const initialValue = {
  authenticated: false,
  setAuthenticated: () => {},
  loading: true,
  setLoading: () => {}
}

const AuthContext = createContext<IAuthContext>(initialValue)

const AuthProvider = ({children}: Props) => {

  const [ authenticated, setAuthenticated ] = useState(initialValue.authenticated)
  const [ loading, setLoading ] = useState(initialValue.loading);
  const memoized = useMemo(()=> ({authenticated, setAuthenticated, loading, setLoading}), [authenticated, loading]);

  useEffect(() => {

    const checkAuthStatus = () => {
      axios.get('http://localhost:5000/api/v1/user/session', {
        withCredentials: true
      }).then(()=>{
        setAuthenticated(true);
      }).catch((err)=>{
        setAuthenticated(false);
        console.log(err);
      }).finally(()=>{
        setLoading(false);
      })
    };
    setLoading(true);
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={memoized}>
      {children}
    </AuthContext.Provider>
  )
}

export {  AuthContext, AuthProvider }