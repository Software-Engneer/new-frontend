const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout'
        },
        USERS: {
            BASE: '/users',
            PROFILE: '/users/profile'
        },
        PRODUCTS: {
            BASE: '/products'
        }
    },
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

export default API_CONFIG; 