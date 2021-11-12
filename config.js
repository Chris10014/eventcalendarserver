// require("dotenv").config(); // this loads env vars

module.exports = {
  secretKey: process.env.SECRET_KEY,
  mongoUrl: "mongodb://localhost:27017/sportevents",
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENTSECRET,
  },
};
