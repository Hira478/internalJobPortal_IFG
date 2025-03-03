import { UploadEmployeeData } from "@/components/UploadEmployeeData"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UploadKaryawanPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Data Karyawan</h1>
      <div className="mb-6">
        <Button asChild>
          <Link href="/template-karyawan.xlsx" download>
            Download Template Excel
          </Link>
        </Button>
      </div>
      <UploadEmployeeData />
    </div>
  )
}

