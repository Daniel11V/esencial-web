import {useState, useEffect, useRef} from 'react'

export default function useFullParentSize () {
    const parentRef = useRef(null);
    const [fullSize, setFullSize] = useState(['100%', '100%'])

    useEffect(() => {
        const handleResize = () => {
            setFullSize(parentRef.current ? [
                parentRef.current.offsetWidth - 30 + "px",
                parentRef.current.offsetHeight - 10 + "px"
            ] : ['100%', '100%'])
        }
        window.addEventListener('resize', handleResize)
        handleResize();
        return () => { window.removeEventListener('resize', handleResize) }
    }, [parentRef?.current?.offsetWidth, parentRef?.current?.offsetHeight])

    return [ fullSize[0], fullSize[1], parentRef ]
}