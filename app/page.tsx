import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MoveRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="w-full max-w-5xl px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-full max-w-[300px] relative mx-auto mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-aIxyRV7cDzsTz9A6Z84kQJDNMyjqIX.png"
              alt="IFG Logo"
              width={300}
              height={100}
              priority
              className="w-full h-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">
            Selamat Datang di Internal Portal Rekrutmen
          </h1>
          <p className="text-xl text-gray-600 italic">Power to Progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <MoveRight className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Manajemen Talenta</h2>
              <p className="text-gray-600">
                Kelola dan kembangkan talenta terbaik untuk masa depan
                perusahaan
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <MoveRight className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Proses Rekrutmen</h2>
              <p className="text-gray-600">
                Optimalkan proses rekrutmen untuk mendapatkan kandidat terbaik
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <MoveRight className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Analisis SDM</h2>
              <p className="text-gray-600">
                Dapatkan wawasan mendalam tentang kinerja dan kebutuhan SDM
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Portal ini dikhususkan untuk PIC SDM Holding dan Anak Perusahaan.
            Silakan gunakan menu navigasi di atas untuk mengakses fitur-fitur
            portal.
          </p>
        </div>
      </div>
    </div>
  );
}
