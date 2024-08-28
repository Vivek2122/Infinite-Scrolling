import React, { useEffect, useState, useRef, useCallback } from 'react'
import './index.css'
import { createClient } from 'pexels';

const client = createClient('0KHYnJzoOZdwwi8jph1keTmKGZkjscsfXTBOOYwQklCFE1SF72J7EDOD');

function Appster() {
    const [query, setQuery] = useState('random images')
    const [imgArr, setImgArr] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    let observer = useRef()
    const lastImage = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
          }
        })
        if (node) observer.current.observe(node)
      }, [loading, hasMore])

    useEffect(() => {
        if(query == ''){
            setError(false)
            setLoading(false)
            return
        }
        setImgArr([])
        setPageNumber(1)
    }, [query])

    useEffect(() => {
        if(query == ''){
            setError(false)
            setLoading(false)
            return
        }
        setLoading(true);
        setError(false);
        client.photos.search({ query, per_page: 40, page: pageNumber })
        .then(photos => {
            console.log(photos);
            setTimeout(() => {setImgArr(prev => {
                return pageNumber === 1 ? photos.photos : [...new Set([...prev, ...photos.photos.map(b => b)])]
            })
            setHasMore(photos.photos.next_page != '');
            setLoading(false);}, 750)
        })
        .catch(err => {
            console.log('error loading the images');
            setError(true);
            setLoading(false);
        })
    }, [query, pageNumber])

  return (
    <div>
        <input type="text" onChange={(e) => {
            setQuery(e.target.value)
            setPageNumber(1)
        }}/>
        <div className='container'>
            {
                imgArr.map((image, index) => {
                    if(index == imgArr.length - 1) {
                        return <img ref={lastImage} className='img' key={image.src.tiny} src={image.src.tiny} alt={image.alt || ''} />
                    } else {
                        return <img  className='img' key={image.src.tiny} src={image.src.tiny} alt={image.alt || ''} />
                    }
                })
            }
        </div>
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
    </div>
  )
}

export default Appster