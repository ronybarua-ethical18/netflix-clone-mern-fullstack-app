const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        res.status(403).json("Token is not valid!");
      }
    });
  }else{
    res.status(403).json("You are not authenticated!");
  }
};

module.exports = verifyToken;
