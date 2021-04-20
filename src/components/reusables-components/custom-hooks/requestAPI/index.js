import {useEffect, useState} from "react";
export function useFetch(url, setUrl, opts) {
    const [response, setResponse] = useState({})
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [message, setMessage] = useState('')
    
    const doFetch=async()=>{
        try{
            setHasError(false);
            setLoading(true);
            setMessage('');
            setResponse({});
            const response = await fetch(url, opts);
            const data = await response.json();
            console.log("fetch data", data);
            setResponse(data);
            setLoading(false);
            setUrl("");
        }catch(err){
            console.log("error",err);
            setMessage(err?.message);
            setLoading(false);
            setHasError(true);
            setResponse({});
            setUrl("");
        }
    };

    useEffect(() => {
        if(url==="")
            return;
        doFetch();
    }, [url])
    return [ response, loading, hasError, message ];
}