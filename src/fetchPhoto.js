// const axios = require('axios');
import axios from 'axios';

const BASEURL = 'https://pixabay.com/api/';
const APIKEY = '31318369-963f8a8f711e2021b1f211060'

// export default async function fetchPhoto(requstedValue, pageNumber) {
//     try {
//         const response = await axios.get(`
//        ${BASEURL}?key=${APIKEY}&q=${requstedValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`)
//         // console.log(response);
//         return response;
//     }
//     catch (error) {
//         return error;
// }
// };

export default class NewApiService{
    constructor() {
        this.requstedValue = '';
        this.page = 1;
    }

    async createRequest() {
        const url = `
       ${BASEURL}?key=${APIKEY}&q=${this.requstedValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
        
        this.pageIncrement();

        try {
            const response = await axios.get(url)
            return response;
        }
        catch (error) {
            return error;
        }
    }

    pageIncrement() {
        this.page += 1
    }

    pageReset() {
        this.page = 1
    }

    get query() {
        return this.requstedValue;
    }

    set query(newValue) {
        this.requstedValue = newValue;
    }
}

// const privateVar = 42

// export const color = '#bababa'

// export function comute(a, b) {
//     return a + b;
// }
// export default {
//     log() {
//         console.log(privateVar);
//     }
// }