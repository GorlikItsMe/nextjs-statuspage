import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const jwtSecret = "SUPERSECRETE20220";

export default function MeAPI(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (!("token" in req.cookies)) {
      res.status(401).json({ message: "Unable to auth" });
      return;
    }
    let decoded;
    const token = req.cookies.token;
    if (token) {
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (e) {
        console.error(e);
        res.status(401).json({ message: "Unable to auth" });
        return;
      }
    }

    if (decoded) {
      res.json(decoded);
      return;
    } else {
      res.status(401).json({ message: "Unable to auth" });
    }
  }
}
