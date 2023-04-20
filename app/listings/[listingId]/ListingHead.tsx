'use client';
import Heading from "@/app/components/Heading";
import HeartButton from "@/app/components/HeartButton";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Image from "next/image";

interface ListingHeadProps {
    title: string;
    imageSrc: string;
    locationValue: string;
    id: string;
    currentUser: SafeUser | null | undefined
}

const ListingHead:React.FC<ListingHeadProps> = ({
    title,
    imageSrc,
    locationValue,
    id,
    currentUser,
}) => {
  const { getByValue } = useCountries();

  const location = getByValue(locationValue);

  return (
    <>
        <Heading
            title={title}
            subtitle={`${location?.region}, ${location?.label}`}
        />
        <div
            className="
                w-full
                h-[60vh]
                overflow-hidden
                rounded-xl
                relative
            "
        >
            <Image
                alt="Image"
                src={imageSrc}
                fill
                className="object-cover w-full"
            />
            <div className="absolute top-5 right-5">
                <HeartButton
                    listingId={id}
                    currentUser={currentUser}
                />
            </div>
        </div>
    </>
  )
}

export default ListingHead