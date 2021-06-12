require("dotenv/config");

import axios from "axios";

export const httpClient = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "X-Riot-Token": process.env.RIOT_API_TOKEN,
  },
});
