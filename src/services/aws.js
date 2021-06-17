import axios from 'axios';
import 'dotenv/config';

const aws = axios.create({
  baseURL: 'https://devmagic.s3.sa-east-1.amazonaws.com',
});

export default aws;
