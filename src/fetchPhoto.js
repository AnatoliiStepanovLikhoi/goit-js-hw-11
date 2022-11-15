// const axios = require('axios');
import axios from 'axios';

const BASEURL = 'https://pixabay.com/api/';
const APIKEY = '31318369-963f8a8f711e2021b1f211060'

export default async function fetchPhoto(requstedValue, pageNumber) {
    try {
        const response = await axios.get(`
       ${BASEURL}?key=${APIKEY}&q=${requstedValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`)
        // console.log(response);
        return response;
    }
    catch (error) {
        return error;
}
}