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
import { createRoom } from '@/services/rooms';
import { Button } from '@/components/ui/button';

// Define the schema using Zod
const formSchema = z.object({
    name: z.string().min(3, {
        message: "Room name must be at least 3 characters.",
    }),
})

const CreateRoom = () => {
    const { createRoomModal, handleCreateRoomModal } = useRoomStore();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const createRoomMutation = useMutation({
        mutationFn: createRoom,
        onSuccess: (data) => {
            toast.success("Room Created!", {
                position: "top-right",
            });
            queryClient.invalidateQueries({
                queryKey: ['rooms'],
                // exact: true,
            })
            handleCreateRoomModal()
        },
        onError: (error: any) => {
            console.log(error)
            toast.error(error?.response?.data.message, {
                position: "top-right",
            });
        },
    });

    const onSubmit = async (data: { name: string }) => {
        createRoomMutation.mutate(data)
    }

    return (
        <Dialog
            open={createRoomModal}
            onOpenChange={handleCreateRoomModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Room</DialogTitle>
                    <DialogDescription>
                        Create a new room to chat with friends.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-[300px]">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter room name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Create</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateRoom