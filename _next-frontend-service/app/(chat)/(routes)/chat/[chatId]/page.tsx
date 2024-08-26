"use client"
import { usePathname, useRouter } from "next/navigation";
import ChatWrapper from "../components/ChatWrapper"
import { useQuery } from "@tanstack/react-query";
import { isRoomMember } from "@/services/rooms";
import { toast } from "sonner";

const page = () => {
    const pathname = usePathname();
    const router = useRouter();
    const chatRoomId = pathname.split("/").pop();

    // console.log(chatRoomId);
    const { data: isMember, error, isLoading, isSuccess } = useQuery({
        queryKey: ['isMember', chatRoomId],
        queryFn: function () {
            return isRoomMember(Number(chatRoomId));
        }
    });

    if (isSuccess && !isMember) {
        toast("You are not a member of this room");
        router.push('/chat');
    }

    return (
        <>
            <ChatWrapper
                showChat={isMember}
            />
        </>
    )
}

export default page