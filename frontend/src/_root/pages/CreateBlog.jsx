import React, { useState } from 'react'
import CreateBlogForm from '../../components/CreateBlogForm'
import PreviewBlogForm from '../../components/PreviewBlogForm'
import { useAuth } from '../../context/AuthContext'
import { useCreateBlog } from '../../lib/react-query/queriesAndMutation'

const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [readTime, setReadTime] = useState('')
  const [slugParam, setSlugParam] = useState('')
  const [content, setContent] = useState([])
  const [imageUrl, setImageUrl] = useState('')

  // extract user from context 
  const { isAuthenticated, isAuthenticatedLoading, isAuthenticatedError, currentUser } = useAuth();

  const {
    mutate: createBlog,
    isLoading,
    isError,
    isSuccess,
  } = useCreateBlog()

  if (isAuthenticatedLoading || isLoading) return <div>Loading...</div>
  if (isAuthenticatedError) return <div>Error: {isAuthenticatedError.message}</div>

  return (
    <div className="flex-1 min-h-0 w-full h-screen flex overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <CreateBlogForm
          className="flex-1 min-h-0 overflow-y-auto"
          title={title}
          setTitle={setTitle}
          videoLink={videoLink}
          setVideoLink={setVideoLink}
          readTime={readTime}
          setReadTime={setReadTime}
          slugParam={slugParam}
          setSlugParam={setSlugParam}
          content={content}
          setContent={setContent}
          setImageUrl={setImageUrl}
          currentUser={currentUser}
          createBlog={createBlog}
        />
        <PreviewBlogForm
          className="flex-1 min-h-0 overflow-y-auto"
          title={title}
          videoLink={videoLink}
          readTime={readTime}
          slugParam={slugParam}
          content={content}
          currentUser={currentUser}
          imageUrl={imageUrl}
        />
      </div>
    </div>
  )
}

export default CreateBlog
