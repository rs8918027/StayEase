import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById"
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams{
    listingId?: string;
}

const ListingPage = async ({ params }:{ params: Promise<IParams> }) => {
    const listing = await getListingById(await params)
    const reservations = await getReservations(await params)
    const currentUser = await getCurrentUser()

    if(!listing){
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }
    return (
        <ClientOnly>
            <ListingClient reservations={reservations} listing={listing} currentUser={currentUser} />
        </ClientOnly>
    )
}

export default ListingPage
