import RoomList from "./RoomList"
import ChatWindow from "./ChatWindow"
import LeftMenu from "./LeftMenu"
import TopMenu from "./TopMenu"

type Props = {
    showChat: boolean
}

const ChatWrapper = ({ showChat }: Props) => {
    return (
        <div className="grid h-screen w-full pl-[56px]">
            <LeftMenu />
            <TopMenu />
            <div className="flex flex-col h-full flex-1">
                <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
                    <RoomList />
                    {showChat ?
                        <ChatWindow />
                        :
                        ''
                    }
                </main>
            </div>
        </div>
    )
}

export default ChatWrapper