import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

const TypingInfo = ({ typingUsers }: { typingUsers: string[] }) => {

    if (typingUsers.length === 0) return null;

    return (
        <div className='flex items-center gap-2'>
            <ThreeDots
                visible={true}
                height="30"
                width="30"
                color="black"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
            <p className='text-xs'><span className='text-black rounded-md font-bold'>{typingUsers.join(', ')}</span> {typingUsers.length > 1 ? "are" : "is"} typing...</p>
        </div>
    )
}

export default TypingInfo