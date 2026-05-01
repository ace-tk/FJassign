// src/controllers/testController.js
// ─────────────────────────────────────────────────────────────────────────────
// This controller handles the GET /api/test protected route.
// The `protect` middleware runs BEFORE this and sets req.user from the token.
// So by the time we get here, we already know the user is authenticated.
// ─────────────────────────────────────────────────────────────────────────────

export const getTestRoute = (req, res) => {
  // req.user was attached by authMiddleware after verifying the JWT
  // It contains: { id, email, iat (issued at), exp (expiry) }
  res.status(200).json({
    message: '✅ You have access! Your token is valid.',
    user: req.user,
  });
};
