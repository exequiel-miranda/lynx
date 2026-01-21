import api from './api';
import { storage } from '../utils/storage';

export const authService = {
    async register(carnet, password) {
        const response = await api.post('/auth/register', { carnet, password });

        if (response.data.token) {
            storage.setToken(response.data.token);
            storage.setUser(response.data.student);
        }

        return response.data;
    },

    async login(carnet, password) {
        const response = await api.post('/auth/login', { carnet, password });

        if (response.data.token) {
            storage.setToken(response.data.token);
            storage.setUser(response.data.student);
        }

        return response.data;
    },

    logout() {
        storage.clear();
    },

    getToken() {
        return storage.getToken();
    },

    getUser() {
        return storage.getUser();
    },

    isAuthenticated() {
        return !!storage.getToken();
    }
};
