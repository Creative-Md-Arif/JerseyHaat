const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("Received token:", token); // debug
  console.log(
    "Expected token from env:",
    process.env.ADMIN_TOKEN || process.env.VITE_ADMIN_TOKEN,
  ); // debug

  if (!token) {
    res.status(401);
    throw new Error("No admin token provided. Access denied.");
  }

  const adminToken = token.startsWith("Bearer ") ? token.slice(7) : token;
  const expectedToken = process.env.ADMIN_TOKEN || process.env.VITE_ADMIN_TOKEN;

  if (adminToken !== expectedToken) {
    console.log(
      "Token mismatch. Received:",
      adminToken,
      "Expected:",
      expectedToken,
    ); // debug
    res.status(403);
    throw new Error("Invalid admin token. Access denied.");
  }

  next();
};

module.exports = { adminAuth };
