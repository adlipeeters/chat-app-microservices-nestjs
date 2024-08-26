"use client";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getRooms } from "@/services/rooms";
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import useRoomStore from "@/store/chat/room_store"
import Spinner from "@/components/Spinner";

const RoomList = () => {
    const { createRoomModal, handleCreateRoomModal } = useRoomStore();
    const { data, error, isLoading, } = useQuery({
        queryKey: ['rooms'],
        queryFn: getRooms,
    });

    // if (isLoading) return <Spinner />

    if (error) return <div>Error: {error.message}</div>;

    if (data) {
        // console.log(data);
    }
    if (error) {
        // console.log(error);
    }
    return (
        <div
            className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
            {isLoading ? <Spinner /> : null}
            <ScrollArea className="min-h-[calc(100vh-10vh)] max-h-[calc(100vh-10vh)] rounded-md border w-full">
                <div className="p-4">
                    <div className="flex gap-2 text-sm mb-4">
                        <Link href={"/chat"} className="bg-black text-white p-1 px-3 rounded-md duration-300 hover:opacity-75">
                            Rooms
                        </Link>
                        <button
                            onClick={handleCreateRoomModal}
                            className="bg-black text-white p-1 px-3 rounded-md duration-300 hover:opacity-75">
                            Create Room
                        </button>
                    </div>
                    {data ? data.map((room: any, _key: number) => (
                        <div key={_key}>
                            <Link href={`/chat/${room.id}`} key={_key}>
                                <div key={room.id} className="text-sm hover:bg-slate-100 w-full h-full py-4 px-2 duration-300 rounded-md">
                                    {room.name}
                                </div>
                            </Link>
                            <Separator className="my-2" />
                        </div>
                    )) : null}
                </div>
            </ScrollArea>
        </div>
    )
}

export default RoomList