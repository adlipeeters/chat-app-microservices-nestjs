"use client"
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Spinner from "@/components/Spinner";

import useDrawerStore from '@/store/chat/drawer_store';
import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/services/rooms';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';


const MobileRoomList = () => {
    const { open, handleDrawer } = useDrawerStore();

    const { data, error, isLoading, } = useQuery({
        queryKey: ['rooms'],
        queryFn: getRooms,
    });
    return (
        <Sheet
            open={open}
            onOpenChange={handleDrawer}
        >
            <SheetContent side={'left'}>
                {isLoading ? <Spinner /> : null}
                <SheetHeader>
                    <SheetTitle>Rooms</SheetTitle>
                    <SheetDescription className='relative'>
                        {data ? data.map((room: any, _key: number) => (
                            <div key={_key}>
                                <Link href={`/chat/${room.id}`} key={_key} onClick={handleDrawer}>
                                    <div key={room.id} className="text-sm hover:bg-slate-100 w-full h-full py-4 px-2 duration-300 rounded-md">
                                        {room.name}
                                    </div>
                                </Link>
                                <Separator className="my-2" />
                            </div>
                        )) : null}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default MobileRoomList