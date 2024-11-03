import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

import axios from "axios"

const FormSchema = z.object({
  name: z.string(),
  password: z.string().min(6, 'Must be min 6 characters').max(50)
  .regex(/(?=.*[a-z])/, 'Atleast one lower case')
  .regex(/(?=.*[A-Z])/, 'Atleast one upper case')
  .regex(/(?=.*\d)/, 'Atleast one digit')
  .regex(/^\S*$/, 'No Spaces!'),
  email: z.string().email(),
});

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    axios.post('http://localhost:5000/api/v1/user/register', data).then(res => {
        if( res.status == 201 ) {
            toast({
                title: "Account created"
            })
        } else {
            toast({
                title: "Some issue"
            })
        }
    }).catch(err=> {
        if ( err.response?.status == 409) {
            toast({
                title:"Email already in use",
                variant: "destructive"
            })
        } else {
            toast({
            
                title:"There is some error",
                description: (
                    <pre><code>{err.message}</code></pre>
                ),
                variant: "destructive"
            })
        }
    })
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
      <Card className="w-full max-w-screen-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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
        </CardContent>
      </Card>
    </div>
  )
}