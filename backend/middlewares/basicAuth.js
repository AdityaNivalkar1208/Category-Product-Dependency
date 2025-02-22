require("dotenv").config();

const basicAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  const validUsername = process.env.API_USERNAME || "alpqmz";
  const validPassword = process.env.API_PASSWORD || "skownx";

  if (username !== validUsername || password !== validPassword) {
    return res.status(403).json({ message: "Invalid username or password" });
  }

  next();
};

module.exports = basicAuth;
