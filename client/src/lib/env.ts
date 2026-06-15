
//const isDev = import.meta.env.MODE === 'development';
//console.log(import.meta.env.NODE_MODE,"import.meta.env.NODE_MODE")

export const ENV = {
    API_URL: `${import.meta.env.VITE_API_URL}`,
    FRONTEND_URL: `${import.meta.env.VITE_FRONTEND_URL}`,
    BASE_API_URL: `${import.meta.env.VITE_BASE_API_URL}`

};
