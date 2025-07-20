import React, { useEffect, useState, useRef } from 'react'
import { ReactReader, EpubView } from 'react-reader'
import { ChevronLeft, ChevronRight, Menu, Bookmark, Settings, Search, Sun, Moon } from 'lucide-react'
import axios from 'axios'

export const Test = () => {
  const [location, setLocation] = useState(0)
  const [rendition, setRendition] = useState(null)
  const [book, setBook] = useState(null)
  const [toc, setToc] = useState([])
  const [showToc, setShowToc] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [bookmarks, setBookmarks] = useState([])
  const [currentChapter, setCurrentChapter] = useState('')
  const [progress, setProgress] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState('light')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  
  const readerRef = useRef(null)

  const handleLocationChanged = (epubcfi) => {
    setLocation(epubcfi)
  }

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get('http://localhost:5000/books/Alice%27s%20Adventures%20in%20Wonderland/bookmarks')
      setBookmarks(request.data)
    }
    fetchData()
  }, [])

  const getRendition = (rendition) => {
    setRendition(rendition)
    const book = rendition.book
    setBook(book)
    
    // Load table of contents
    book.loaded.navigation.then((nav) => {
      setToc(nav.toc)
    })
    
    // Track reading progress and current chapter
    rendition.on('relocated', (location) => {
      setProgress(Math.round(location.start.percentage))
      
      // Find current chapter
      const currentSection = book.spine.get(location.start.cfi)
      if (currentSection) {
        setCurrentChapter(currentSection.href)
      }
    })

    // Apply theme
    applyTheme(rendition, theme)
  }

  const applyTheme = (rendition, selectedTheme) => {
    if (!rendition) return
    
    const themes = {
      light: {
        body: { color: '#000', background: '#fff' },
        a: { color: '#0066cc' }
      },
      dark: {
        body: { color: '#fff', background: '#1a1a1a' },
        a: { color: '#66b3ff' }
      },
      sepia: {
        body: { color: '#5c4b37', background: '#f4f1ea' },
        a: { color: '#8b4513' }
      }
    }
    
    rendition.themes.default(themes[selectedTheme])
  }

  const changeFontSize = (size) => {
    setFontSize(size)
    if (rendition) {
      rendition.themes.fontSize(`${size}px`)
    }
  }

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    if (rendition) {
      applyTheme(rendition, newTheme)
    }
  }

  const goToChapter = (href) => {
    if (rendition) {
      rendition.display(href)
      setShowToc(false)
    }
  }

  const nextPage = () => {
    if (rendition) {
      rendition.next()
    }
  }

  const prevPage = () => {
    if (rendition) {
      rendition.prev()
    }
  }

  const addBookmark = async () => {
    if (location && !bookmarks.includes(location)) {
      const response = await axios.post('http://localhost:5000/books/6850c4f83d9445e0ebc5af39/bookmarks', {
        location: location,
        text: "test"
      })
      setBookmarks([...bookmarks, location])
    }
  }

  const goToBookmark = (bookmark) => {
    if (rendition) {
      rendition.display(bookmark['location'])
    }
  }

  const searchInBook = async (term) => {
    if (!book || !term) return
    
    try {
      const results = await book.spine.spineItems.map(async (item) => {
        const section = await book.load(item.href)
        const text = await section.load()
        // Simple search implementation
        if (text.includes(term)) {
          return { href: item.href, text: text.substring(0, 100) }
        }
        return null
      })
      
      const searchResults = (await Promise.all(results)).filter(Boolean)
      console.log('Search results:', searchResults)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [showControls])

  return (
    <div 
      style={{ height: '100vh', width: '100vw', position: 'relative' }}
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
    >
      

      
        <EpubView
          className = "react-read"
          url="https://react-reader.metabits.no/files/alice.epub"
          location={location}
          locationChanged={handleLocationChanged}
          getRendition={getRendition}
        />
          {/* Top Navigation Bar */}
          <div className={`fixed top-0 left-0 right-0 bg-white shadow-md transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowToc(!showToc)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Menu size={20} />
                </button>
                <h3 className="text-sm font-semibold truncate max-w-md">
                  Alice's Adventures in Wonderland
                </h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={addBookmark}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
            
            
          </div>


          {/* Table of Contents Sidebar */}
          {showToc && (
            <div className="fixed left-0 top-0 w-80 h-full bg-white shadow-lg z-40 overflow-y-auto">
              
              
              <div className="p-4">
                
                
                {bookmarks.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Bookmarks</h3>
                    {bookmarks.map((bookmark, index) => (
                      <button
                        key={index}
                        onClick={() => goToBookmark(bookmark)}
                        className="block w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                      >
                        Bookmark {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Control Bar */}
          <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-md z-50 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevPage}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextPage}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              
            </div>
          </div>
    </div>
  )
}