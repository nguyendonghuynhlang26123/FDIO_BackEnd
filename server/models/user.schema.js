const db = require("../../connectFirebase");

const user = db.collection("users");

module.exports = user;