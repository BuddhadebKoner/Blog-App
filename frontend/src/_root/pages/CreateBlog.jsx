import React, { useState } from 'react'
import CreateBlogForm from '../../components/CreateBlogForm'
import PreviewBlogForm from '../../components/PreviewBlogForm'
import { useAuth } from '../../context/AuthContext'
import { LoaderCircle } from 'lucide-react'
import { Helmet } from 'react-helmet'

const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [readTime, setReadTime] = useState('')
  const [slugParam, setSlugParam] = useState('')
  const [content, setContent] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  // extract user from context 
  const { isAuthenticated, isAuthenticatedLoading, isAuthenticatedError, currentUser } = useAuth();

  if (isAuthenticatedError) return <div>Error: {isAuthenticatedError.message}</div>

  if (loading || isAuthenticatedLoading) {
    return (
      <div className='flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 dark:border-[var(--color-border-dark)]'>
        <LoaderCircle className='animate-spin w-10 h-10' />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Create Blog - Blog</title>
      </Helmet>

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
            setLoading={setLoading}
            loading={loading}
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
    </>
  )
}

export default CreateBlog
