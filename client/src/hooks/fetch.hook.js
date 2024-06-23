import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** custom hook */
export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

    useEffect(() => {
        let isMounted = true; // flag to track if component is mounted

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }));

                let response;
                if (!query) {
                    const { username } = await getUsername();
                    response = await axios.get(`/api/user/${username}`);
                } else {
                    response = await axios.get(`/api/${query}`);
                }

                if (isMounted) {
                    if (response.status === 200) {
                        setData(prev => ({ ...prev, isLoading: false, apiData: response.data, status: response.status }));
                    } else {
                        setData(prev => ({ ...prev, isLoading: false, serverError: `Error: ${response.statusText}`, status: response.status }));
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setData(prev => ({ ...prev, isLoading: false, serverError: error.message }));
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [query]);

    return [getData, setData];
}
