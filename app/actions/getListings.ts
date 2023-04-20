import prisma from "@/app/libs/prismadb";
import { Listing } from "@prisma/client";
import { SafeListing } from "../types";

export default async function getListings() {
   try {
      const listings = await prisma.listing.findMany({
        orderBy: {
            createdAt: 'desc'
        }
      })

      const safeListings:SafeListing[] = listings.map((listing:Listing) =>({
         ...listing,
         createdAt: listing.createdAt.toISOString()
      }));

      return safeListings
   } catch (error: any) {
      throw new Error(error);
   }
}