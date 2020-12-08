export const httpClient = () => {
    const updateRequest = async (url, body, method) => {
        const headers = { 'Content-Type': 'application/json' };
        const response = await fetch(`/api/${url}`, { method, body: JSON.stringify(body), headers });
        return response.ok ? response.json() : Promise.reject(response);
    };
    return {
        async get(url) {
            const response = await fetch(`/api/${url}`)
            return response.ok ? response.json() : Promise.reject(response)
        },
        async post(url, body) {
            return updateRequest(url, body, 'post');
        },
        async put(url, body) {
            return updateRequest(url, body, 'put');
        },
        async delete(url) {
            const response = await fetch(`/api/${url}`, { method: 'delete' });
            return response.ok ? Promise.resolve() : Promise.reject(response);
        },
    }
}
