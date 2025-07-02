import React, { useEffect, useState } from 'react'
import { ReactReader } from 'react-reader'

export const Test = () => {
  const [location, setLocation] = useState(0)
  useEffect(()=>{
    console.log("ReactReader", ReactReader)
  }, [])
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url="https://react-reader.metabits.no/files/alice.epub"
        location={location}
        locationChanged={(epubcfi) => setLocation(epubcfi)}
      />
    </div>
  )
}