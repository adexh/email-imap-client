import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { useLocation, useNavigate } from "react-router-dom"
import qs from 'qs';
import { useEffect } from "react"

axios.defaults.withCredentials = true;

export default function EmailLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const qsData = qs.parse(location.search?.slice(1));

  const isCode = !!qsData.code;

  useEffect(() => {
    const saveToken = ()=> {
      axios.post("http://localhost:5000/api/v1/mail/savetoken", {
        code: qsData.code
      }).then(()=>{
        return navigate('/');
      }).catch(()=>{
        toast({
          title:"Error while linking account",
          variant: "destructive"
        })
      })
    }

    if( qsData.code ) {
      saveToken();
    }
  }, [qsData.code, navigate])

  const handler = () => {
    axios.get("http://localhost:5000/api/v1/mail/genlinkurl", {withCredentials:true})
    .then(res => {
      window.location.href = res.data;
    }).catch(err => {
      toast({
        title:"Failed to generate url",
        description: err.message
      })
    })
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
      <Card className="max-w-screen-md flex flex-col justify-center">
        <CardHeader className="flex flex-row justify-center">
          <CardTitle >Link your outlook account to continue</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row justify-center">
            <Button onClick={handler}  disabled={isCode}>Click here</Button>
        </CardContent>
      </Card>
    </div>
  )
}