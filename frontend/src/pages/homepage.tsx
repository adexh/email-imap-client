import { toast } from "@/components/ui/use-toast";
import axios from "axios"
import { useEffect, useState } from "react"

export default function Home() {

    const [ mailList, setMailList ] = useState([]);

    useEffect(()=> {
        axios.get('http://localhost:5000/api/v1/mail/getEmails')
        .then( res => {
            setMailList(res.data);
        })
        .catch( err => {
            toast({
                title: "Issue in fetching emails",
                description: err.message,
                variant: "destructive"
            })
        } )
    }, [])

    return (
        <div>
            <div className="px-5 py-2 text-2xl">Emails Below</div>
            <div className="px-5">
                {mailList.map((mail, idx) => {
                    return (
                        <div key={idx}>{mail.sendersName}</div>
                    )
                })}
            </div>
        </div>
    )
}