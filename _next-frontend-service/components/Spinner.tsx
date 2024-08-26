import React from 'react'
import { Comment } from 'react-loader-spinner'

const Spinner = () => {
    return (
        <div className='absolute w-full h-full flex justify-center items-center backdrop-blur-sm duration-300 transition-all'>
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

export default Spinner