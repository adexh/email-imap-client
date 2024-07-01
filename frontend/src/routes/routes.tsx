import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login'
import Register from '../pages/register'
import EmailLink from '@/pages/emailLink';

function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route> {/* Add layout element */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/emailLink' element={<EmailLink/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default MyRoutes;