import { Nunito } from "next/font/google"
import './globals.css'
import ToasterProvider from "./providers/ToasterProvider"
import RegisterModal from "./components/modals/RegisterModal"
import RentModal from "./components/modals/RentModal"
import LoginModal from "./components/modals/LoginModal"
import getCurrentUser from "./actions/getCurrentUser"
import Navbar from "./components/navbar/Navbar"


export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb clone',
}

const font = Nunito({
  subsets: ["latin"],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        {/* Uncomment this if you have hydration errors <ClientOnly> */}
          <ToasterProvider/>
          <RentModal/>
          <RegisterModal/>
          <LoginModal/>
          <Navbar currentUser={currentUser} />
        {/* </ClientOnly> */}
        <div className="pb-20 pt-28">
         {children}
        </div>
      </body>
    </html>
  )
}