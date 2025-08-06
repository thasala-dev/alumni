import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function DemoNotice() {
  // This component is now always relevant as we are always in demo mode
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>โหมดทดสอบ:</strong> ระบบกำลังทำงานในโหมดทดสอบ
        <br />
        <span className="text-sm">
          Admin: admin@example.com / admin123 | Alumni: alumni@example.com / alumni123 | Pending: pending@example.com /
          pending123
        </span>
      </AlertDescription>
    </Alert>
  )
}
