require("dotenv/config");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

export const DB_CONNECION_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
