import PhotoList from './PhotoList/PhotoList'

const {
  createContext, useState, useEffect, useContext,
} = require('react')

const PhotoContext = createContext()

function Photos() {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/photos')
      .then((responce) => responce.json())
      .then((dataFromServer) => setPhotos(dataFromServer))
  }, [])

  const addPhoto = (newPhoto) => {
    setPhotos((prev) => [...prev, newPhoto])
  }

  const deletePhoto = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id))
  }

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, deletePhoto }}>
      <PhotoList />
    </PhotoContext.Provider>
  )
}

export default Photos

const usePhotosContext = () => useContext(PhotoContext)

export {
  PhotoContext,
  usePhotosContext,
}
