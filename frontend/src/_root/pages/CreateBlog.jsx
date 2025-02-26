import React, { useState } from 'react'
import CreateBlogForm from '../../components/CreateBlogForm'
import PreviewBlogForm from '../../components/PreviewBlogForm'
import { useAuth } from '../../context/AuthContext'

const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [readTime, setReadTime] = useState('')
  const [slugParam, setSlugParam] = useState('')
  const [content, setContent] = useState([])
  const [blogImage, setBlogImage] = useState(null)
  // extract user from context 
  const { isAuthenticated, isAuthenticatedLoading, isAuthenticatedError, currentUser } = useAuth();

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
          blogImage={blogImage}
          setBlogImage={setBlogImage}
        />
        <PreviewBlogForm
          className="flex-1 min-h-0 overflow-y-auto"
          title={title}
          imageUrl={blogImage}
          videoLink={videoLink}
          readTime={readTime}
          slugParam={slugParam}
          blogImage={blogImage}
          content={content}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}

export default CreateBlog
