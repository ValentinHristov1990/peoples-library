import { useState } from "react";

export default function useLoading() {

    const [loading, setLoading] = useState(false)

    const isLoading = async (action) => {
        setLoading(true);
        try {
            return await action()
        } finally {
            setLoading(false)
        }
    }
    return { loading, setLoading, isLoading };
}
