import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EmailLink() {

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
      <Card className="max-w-screen-md flex flex-col justify-center">
        <CardHeader className="flex flex-row justify-center">
          <CardTitle >Link your outlook account to continue</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row justify-center">
            <Button>Click here</Button>
        </CardContent>
      </Card>
    </div>
  )
}