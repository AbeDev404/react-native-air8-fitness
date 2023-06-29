import {useState, useEffect} from 'react';
import * as VideoThumbnails from 'expo-video-thumbnails'

const useVideoThumbnails = () => {
    const [uri, setUri] = useState(null);

    const generateThumbnail = (url, time) => {
        console.log(url, time);
        VideoThumbnails.getThumbnailAsync(url, {time: time}).then((result) => {
            console.log(result)
        }).catch(error => {
            console.log(error);
        });
        // try {
        //     const { uri } = await VideoThumbnails.getThumbnailAsync(url, {time: time});
        //     setUri(uri);
        // } catch (e) {
        //     console.log(e);
        // }
    };

    return [uri, generateThumbnail];
}

export default useVideoThumbnails