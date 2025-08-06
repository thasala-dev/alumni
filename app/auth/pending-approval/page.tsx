import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail } from 'lucide-react'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl"> {/* Added shadow and rounded corners */}
        <CardHeader className="text-center space-y-2"> {/* Adjusted spacing */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 shadow-md"> {/* Larger icon container, added shadow */}
            <Clock className="h-8 w-8 text-yellow-600" /> {/* Larger icon */}
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-900">รออนุมัติ</CardTitle> {/* Larger, bolder title */}
          <CardDescription className="text-gray-600">บัญชีของคุณอยู่ระหว่างการตรวจสอบ</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6"> {/* Increased spacing */}
          <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 shadow-sm"> {/* Enhanced alert styling */}
            <Mail className="h-10 w-10 text-yellow-600 mx-auto mb-3" /> {/* Larger icon */}
            <p className="text-base text-gray-700 leading-relaxed"> {/* Adjusted text size and line height */}
              เราได้รับข้อมูลของคุณแล้ว ผู้ดูแลระบบจะตรวจสอบและอนุมัติบัญชีของคุณภายใน 1-2 วันทำการ
            </p>
          </div>
          <div className="text-sm text-gray-500">คุณจะได้รับอีเมลแจ้งเตือนเมื่อบัญชีได้รับการอนุมัติแล้ว</div> {/* Adjusted text size */}
        </CardContent>
      </Card>
    </div>
  )
}
