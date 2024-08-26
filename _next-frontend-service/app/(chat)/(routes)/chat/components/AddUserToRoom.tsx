"use client";

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import useRoomStore from "@/store/chat/room_store"

import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addUserToRoom as AddToRoom } from '@/services/rooms';
import { Button } from '@/components/ui/button';
import { SearchUser } from './SearchUser';
import { UserSelectOption } from '@/types/user';


const AddUserToRoom = () => {
    const [userData, setUserData] = React.useState<UserSelectOption | null>(null)
    const { addUserToRoom, handleAddUserToRoom } = useRoomStore();
    const queryClient = useQueryClient();

    const createRoomMutation = useMutation({
        mutationFn: AddToRoom,
        onSuccess: (data) => {
            toast.success("User Aded!", {
                position: "top-right",
            });
            queryClient.invalidateQueries({
                // queryKey: ['rooms'],
                // exact: true,
            })
            handleAddUserToRoom({
                open: false,
                roomId: 0,
            })
        },
        onError: (error: any) => {
            console.log(error)
            toast.error(error?.response?.data.message, {
                position: "top-right",
            });
        },
    });

    const onOpenChange = () => {
        handleAddUserToRoom({
            open: !addUserToRoom.open,
            roomId: addUserToRoom.roomId,
        })
    }

    const onSubmit = async () => {
        console.log(userData)
        console.log(addUserToRoom)
        if (userData !== null && userData.user_id && addUserToRoom.roomId) {
            createRoomMutation.mutate({
                room_id: addUserToRoom.roomId,
                user_id: userData.user_id,
            })
        } else {
            toast.error("Please select a user", {
                position: "top-right",
            });
        }
    }

    return (
        <Dialog
            open={addUserToRoom.open}
            onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add User To Room</DialogTitle>
                    <DialogDescription>
                        {/* Add a user to a room */}
                    </DialogDescription>
                </DialogHeader>
                <SearchUser
                    userData={userData}
                    setUserData={setUserData}
                />
                <Button onClick={onSubmit} type="submit">Add</Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddUserToRoom