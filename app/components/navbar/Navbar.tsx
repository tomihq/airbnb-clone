//'use client';

import Container from "../Container"
import Logo from "./Logo"
import Search  from "./Search"
import UserMenu from "./UserMenu"
import { SafeUser } from "@/app/types"


interface NavbarProps {
  //Utilizamos el User que está en prisma client porque es el mismo que utilizamos en el prisma.schema */
  currentUser?: SafeUser | null;
}

export const Navbar:React.FC<NavbarProps> = ({currentUser}: NavbarProps) => {


  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
       <div className="py-4 border-b-[1px]">
            <Container>
                <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                    <Logo/>
                    <Search/>
                    <UserMenu currentUser={currentUser} />
                </div>
            </Container>
       </div>
    </div>
  )
}
