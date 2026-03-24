export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!response.ok) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const keycloakUser = await response.json();

    req.user = keycloakUser;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
