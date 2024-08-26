import React from 'react'
import { Comment } from 'react-loader-spinner'

const SpinnerFullHeight = () => {
    return (
        <div className='absolute w-full min-h-screen flex justify-center items-center backdrop-blur-sm duration-300 transition-all z-50'>
            <Comment
                visible={true}
                height="80"
                width="80"
                ariaLabel="comment-loading"
                wrapperStyle={{}}
                wrapperClass="comment-wrapper"
                color="white"
                backgroundColor="black"
            />
        </div>
    )
}

export default SpinnerFullHeight