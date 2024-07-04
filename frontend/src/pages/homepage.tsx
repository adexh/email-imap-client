import { useContext } from "react"
import { EmailTable } from "@/components/emailTable";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";

export default function Home() {

  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

    const handleLogout = async() => {
      try {
        await axiosInstance.post('/user/logout')
        setAuthenticated(false);
        navigate('/login');
      } catch (error) {
        console.log("Some error in logout");
      }
    }

  return (
    <div>
      <div className="flex justify-end p-5">
        <Button onClick={handleLogout} className="">Logout</Button>
      </div>
      <div className="px-16 text-2xl">Your Emails</div>
      <div className="px-16">
        <EmailTable />
      </div>
    </div>
  )
}