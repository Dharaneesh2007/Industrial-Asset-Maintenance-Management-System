import axios from 'axios';

let api = null;
if (typeof axios?.create === 'function') {
  api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

if (!api) {
  api = axios || {};
}

if (api && api.interceptors && api.interceptors.request) {
  api.interceptors.request.use(
    (config) => {
      const isAuthEndpoint =
        config?.url?.includes('/auth/login') || config?.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.token && user.token !== 'null' && user.token !== 'undefined') {
              if (!config.headers) {
                config.headers = {};
              }
              const authValue = `Bearer ${user.token}`;
              if (typeof config.headers.set === 'function') {
                config.headers.set('Authorization', authValue);
              } else {
                config.headers.Authorization = authValue;
                config.headers['Authorization'] = authValue;
              }
            }
          }
        } catch (e) {
          console.warn('[AssetArc API] Error parsing user session token from localStorage:', e);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

if (api && api.interceptors && api.interceptors.response) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        const isAuthPage =
          typeof window !== 'undefined' &&
          (window.location?.pathname?.includes('/login') ||
            window.location?.pathname?.includes('/register'));

        if (!isAuthPage) {
          try {
            localStorage.removeItem('user');
          } catch {
            // Ignore storage errors
          }
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = '/login';
          }
        }
      } else if (status === 403) {
        console.warn(
          `[AssetArc API] 403 Forbidden on ${error?.config?.method?.toUpperCase()} ${error?.config?.url}. Authenticated user may lack required role or permissions.`
        );
      } else if (!error?.response) {
        console.error(
          `[AssetArc API] Network or CORS connection error on ${error?.config?.method?.toUpperCase()} ${error?.config?.url}`
        );
      }
      return Promise.reject(error);
    }
  );
}

export default api;
