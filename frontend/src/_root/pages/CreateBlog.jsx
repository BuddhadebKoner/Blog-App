import React, { useState } from 'react'
import CreateBlogForm from '../../components/CreateBlogForm'
import PreviewBlogForm from '../../components/PreviewBlogForm'

const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageId, setImageId] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [readTime, setReadTime] = useState('')
  const [slugParam, setSlugParam] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [content, setContent] = useState([])

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <CreateBlogForm
        title={title}
        setTitle={setTitle}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        imageId={imageId}
        setImageId={setImageId}
        videoLink={videoLink}
        setVideoLink={setVideoLink}
        readTime={readTime}
        setReadTime={setReadTime}
        slugParam={slugParam}
        setSlugParam={setSlugParam}
        isPublished={isPublished}
        setIsPublished={setIsPublished}
        publishedAt={publishedAt}
        setPublishedAt={setPublishedAt}
        content={content}
        setContent={setContent}
      />
      <PreviewBlogForm
        title={title}
        imageUrl={imageUrl}
        videoLink={videoLink}
        readTime={readTime}
        slugParam={slugParam}
        isPublished={isPublished}
        publishedAt={publishedAt}
        content={content}
      />
    </div>
  )
}

export default CreateBlog
