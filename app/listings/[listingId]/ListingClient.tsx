import { SafeListing } from "@/app/types"
import { SafeUser } from '../../types/index';
import { Reservation } from "@prisma/client";

interface ListingClientProps {
    reservations?: Reservation[]
    listing: SafeListing & {user: SafeUser}
    currentUser?: SafeUser | null
}

const ListingClient:React.FC<ListingClientProps> = ({listing, currentUser}) => {
  return (
    <div>ListingClient</div>
  )
}

export default ListingClient