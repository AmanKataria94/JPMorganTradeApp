import axios from 'axios';

export default class Api {
    get(symbol, params) {
        return axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=btoiqpf48v6t4tuj9ab0`, params);
    }
}