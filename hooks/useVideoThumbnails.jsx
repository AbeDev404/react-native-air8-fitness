import {useState, useEffect} from 'react';
import * as VideoThumbnails from 'expo-video-thumbnails'

const useVideoThumbnails = () => {
    const [uri, setUri] = useState(null);

    const generateThumbnail = (url, time) => {
        VideoThumbnails.getThumbnailAsync(url, {time: time}).then((result) => {
            console.log(result);
            setUri(result.uri)
        }).catch(error => {
            console.log(error)
        });
    };

    return [uri, generateThumbnail];
}

export default useVideoThumbnails