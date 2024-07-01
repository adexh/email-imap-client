import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// import { userSchema } from "shared-types"

const FormSchema = z.object({
  password: z.string().min(6, 'Must be min 6 characters').max(50)
    .regex(/(?=.*[a-z])/, 'Atleast one lower case')
    .regex(/(?=.*[A-Z])/, 'Atleast one upper case')
    .regex(/(?=.*\d)/, 'Atleast one digit')
    .regex(/^\S*$/, 'No Spaces!'),
  email: z.string().email(),
});

export default function InputForm() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {

    axios.post('http://localhost:5000/api/v1/user/login', data).then(() => {

      return navigate("/");
    }).catch(err => {
      toast({

        title: "There is some error",
        description: (
          <pre><code>{err.message}</code></pre>
        ),
        variant: "destructive"
      })
    })
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
      <Card className="w-full max-w-screen-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        type="password"
                        placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
          <div className="py-2 text-gray-500">Don't have an account ? <a href='/register' className="underline underline-offset-2 hover:text-black">click here</a></div>
        </CardContent>
      </Card>
    </div>
  )
}