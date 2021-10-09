import { useCallback, useState } from 'react'
import * as uploadApi from 'services/uploadApi'

const UploadFile = () => {
  const [selectedFiles, setSelectedFiles] = useState({})
  const onFilesChange = useCallback((e) => {
    setSelectedFiles(e.target.files)
  }, [])

  const onFilesUpload = async () => {
    const formData = new FormData()

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`${i}`, selectedFiles[i])
    }
    const [succeeded, data] = await uploadApi.upload(formData)
    succeeded && console.log(data)
  }

  const renderImgList = () => {
    const compList = []
    for (let i = 0; i < selectedFiles.length; i++) {
      const imgSrc = URL.createObjectURL(selectedFiles[i])
      compList.push(
        <div style={{ width: '33%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={imgSrc}
          />
        </div>
      )
    }

    return compList
  }

  return (
    <>
      <div>
        <input
          type='file'
          multiple
          accept='image/png, image/jpeg'
          onChange={onFilesChange}
        />
        <button
          style={{ background: 'red', padding: '20px', color: 'white' }}
          type='button'
          onClick={onFilesUpload}
        >
          Tải hình
        </button>
      </div>
      <div className='flex flex-wrap'>{renderImgList()}</div>
    </>
  )
}

export default UploadFile
