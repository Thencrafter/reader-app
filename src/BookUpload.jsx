import React, { useEffect, useState } from 'react'
import { ReactReader } from 'react-reader'


const BookUpload = () => {
  const [bookUrl, setBookUrl] = useState(null)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBookUrl(event.target.result);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {!bookUrl ? (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Upload EPUB Book</h2>
          <input
            type="file"
            accept=".epub"
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        <div style={{ height: '100%' }}>
          <button
            onClick={() => setBookUrl(null)}
            style={{ margin: '10px' }}
          >
            Upload New Book
          </button>
          <div style={{ height: 'calc(100% - 50px)' }}>
            <ReactReader url={bookUrl}
              style={{
                height: '100vh',
                width: '100vw'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BookUpload