import React, { useEffect, useState } from 'react'
import { ReactReader } from 'react-reader'

export const Test = () => {
  const [location, setLocation] = useState(0)
  useEffect(()=>{
    console.log("ReactReader", ReactReader)
  }, [])
  const handleLocationChanged = (epubcfi) =>{
    console.log("location", epubcfi);
    setLocation(epubcfi)
  } 
  const getRendition = (rendition) => {
    console.log('Rendition received:', rendition)
    
    // Access the book object
    const book = rendition.book
    console.log('Book object:', book)

    // Log book metadata when ready
    book.ready.then(() => {
      console.log('📚 Book Title:', book.package.metadata.title)
      console.log('👤 Author:', book.package.metadata.creator)
      console.log('🌍 Language:', book.package.metadata.language)
      console.log('📖 Publisher:', book.package.metadata.publisher)
      console.log('📋 Full metadata:', book.package.metadata)
    })

    // Log table of contents
    book.loaded.navigation.then((nav) => {
      console.log('📑 Table of Contents:', nav.toc)
    })

    // Log spine (chapters)
    book.loaded.spine.then((spine) => {
      console.log('📄 Total chapters/sections:', spine.items.length)
      console.log('📚 Spine items:', spine.items)
    })

    // Log when sections are rendered
    rendition.on('rendered', (section) => {
      console.log('✅ Rendered section:', section.href)
    })

    // Log location changes with details
    rendition.on('relocated', (location) => {
      console.log('📍 New location details:', location)
      console.log('📊 Reading progress:', location.start.percentage + '%')
    })
  }
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactReader
        url="https://react-reader.metabits.no/files/alice.epub"
        location={location}
        locationChanged={handleLocationChanged}
        getRendition={getRendition}
      />
    </div>
  )
}