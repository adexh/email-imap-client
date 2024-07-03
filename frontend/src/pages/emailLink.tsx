import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axios"
import { toast } from "@/components/ui/use-toast"
import { useLocation, useNavigate } from "react-router-dom"
import qs from 'qs';
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/authContext"

export default function EmailLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated } = useContext(AuthContext);
  const qsData = qs.parse(location.search?.slice(1));

  const [btnDisable, setBtnDisable] = useState(!!qsData.code);

  useEffect(() => {
    const saveToken = () => {
      axiosInstance.post("/mail/savetoken", {
        code: qsData.code
      }).then(() => {
        return navigate('/');
      }).catch(() => {
        toast({
          title: "Error while linking account",
          variant: "destructive"
        })
      }).finally(() => {
        setBtnDisable(false);
      })
    }

    if (qsData.code) {
      setBtnDisable(true);
      saveToken();
    }
  }, [qsData.code, navigate])

  const handler = () => {
    axiosInstance.get("/mail/genlinkurl", { withCredentials: true })
      .then(res => {
        window.location.href = res.data;
      }).catch(err => {
        toast({
          title: "Failed to generate url",
          description: err.message
        })
      })
  }

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/user/logout')
      setAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.log("Some error in logout");
    }
  }

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
        <div className="flex justify-end p-5 absolute top-0 right-0">
          <Button onClick={handleLogout} className="">Logout</Button>
        </div>
        <Card className="max-w-screen-md flex flex-col justify-center">
          <CardHeader className="flex flex-row justify-center">
            <CardTitle >Link your outlook account to continue</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row justify-center">
            <Button onClick={handler} disabled={btnDisable}>Click here</Button>
          </CardContent>
        </Card>
      </div>
    </>

  )
}