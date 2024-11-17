import jwt from "jsonwebtoken";

const CekToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  jwt.verify(token, "kN33cH3k", (err, decoded) => {
    if (err) {
      res.status(403).json({
        message: err.message,
        loggedIn: false,
      });
    } else {
      req.email = decoded.email;
      next();
    }
  });
};

export default CekToken;
