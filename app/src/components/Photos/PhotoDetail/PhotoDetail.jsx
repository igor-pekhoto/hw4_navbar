import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PhotoFormExample from '../../Forms/PhotoForm/PhotoFormExample/PhotoFormExample'
import Modal from '../../Modal/Modal'

function PhotoDetail() {
  const { photosId } = useParams()
  const navigate = useNavigate()
  const [viewModal, setViewModal] = useState(false)

  const controller = useRef(new AbortController())

  const [photo, setPhoto] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/photos/${photosId}`, { signal: controller.current.signal })
      .then((response) => response.json())
      .then((dataFromServer) => setPhoto(dataFromServer))

    return () => { controller.current.abort() }
  }, [])

  const openModal = () => {
    setViewModal(true)
  }

  const closeModal = () => {
    setViewModal(false)
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    const formData = Object.fromEntries(new FormData(e.target).entries())

    const response = await fetch(`http://localhost:3001/api/v1/photos/${photo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.status === 200) {
      const upadtedPhotoFromServer = await response.json()
      setPhoto(upadtedPhotoFromServer)
      closeModal()
    } else {
      alert('Wrong data')
    }
  }

  const content = () => {
    if (!photo.id) {
      return (
        <p className="text-center">
          loading
        </p>
      )
    }

    return (
      <>
        <div className="d-flex flex-column align-items-center">
          <div className="card mb-3" style={{ width: '300px' }}>
            <img src={photo.url} className="card-img-top mb-2" alt={photo.url} />
            <div className="card-body p-1 d-flex flex-column">
              <div className="card p-1" style={{ textAlign: 'left' }}>{photo.title}</div>
              <div className="card p-1" style={{ textAlign: 'left' }}>{photo.description}</div>
              <div className="card mb-3 p-1" style={{ textAlign: 'left' }}>
                #
                {photo.tag}
              </div>
              <button onClick={openModal} type="button" className="btn btn-primary">Edit</button>
            </div>
          </div>
          <button onClick={() => { navigate('..') }} type="button" className="btn btn-danger">Back</button>
        </div>
        <Link to={`/photos/${photo.id}/comments/${photo.id}`}>
          <div className="d-flex flex-column align-items-center mt-3">
            <button type="button" className="btn btn-success">Comments</button>
          </div>
        </Link>
        <Modal state={viewModal}>
          <PhotoFormExample submitHandler={submitHandler} {...photo} />
          <div className="d-flex flex-column align-items-center mt-3">
            <button onClick={closeModal} type="button" className="btn btn-danger">Close</button>
          </div>
        </Modal>
      </>

    )
  }

  return (
    <div>
      {content()}
    </div>
  )
}

export default PhotoDetail
