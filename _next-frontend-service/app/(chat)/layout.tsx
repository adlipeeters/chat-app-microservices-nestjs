import ProtectedRoutes from "@/providers/ProtectedRoutes";
import CreateRoom from "./(routes)/chat/components/CreateRoom";
import AddUserToRoom from "./(routes)/chat/components/AddUserToRoom";
import MobileRoomList from "./(routes)/chat/components/MobileRoomList";

const ChatLayout = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <div className="h-full w-full">
            {children}
            <CreateRoom />
            <AddUserToRoom />
            <MobileRoomList />
        </div>
    );
}

export default ChatLayout;