"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { login } from "@/services/auth"
import { Login } from "@/types/auth"
import { useRouter } from "next/navigation"
import Spinner from "@/components/SpinnerFullHeight"

// Define the schema using Zod
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export function LoginForm() {
    const queryClient = useQueryClient();
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(data)
            toast.success("Logged in successfully!", {
                position: "top-right",
            });
            //   queryClient.invalidateQueries(["profile_info"], { exact: true });
            queryClient.invalidateQueries({
                queryKey: ['profile_info'],
                // exact: true,
            })
            //   handleClose();
            // redirect to /
            router.push("/chat")
        },
        onError: (error: any) => {
            console.log(error)
            toast.error(error?.response?.data.message, {
                position: "top-right",
            });
        },
    });

    console.log(loginMutation)

    const onSubmit = async (data: Login) => {
        loginMutation.mutate(data)
    }

    if (loginMutation.isPending) {
        return <Spinner />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-[300px]">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormDescription>
                                Make sure it's at least 6 characters.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Login</Button>
            </form>
        </Form>
    )
}
