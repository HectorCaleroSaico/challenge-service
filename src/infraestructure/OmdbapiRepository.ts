import axios, { Axios } from 'axios';

export const apiClient: Axios = axios.create({
    baseURL: 'http://www.omdbapi.com/'
});


export class OmdbapiRepository {}