import { NextApiRequest, NextApiResponse } from "next";
import assert from "assert";
import jwt from "jsonwebtoken";

const jwtSecret = "SUPERSECRETE20220";

export default function AuthAPI(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // login
    try {
      assert.notEqual(null, req.body.login, "Login required");
      assert.notEqual(null, req.body.password, "Password required");
    } catch (bodyError) {
      res.status(403).json({ error: true, message: bodyError.message });
      return;
    }

    // verify
    const login = req.body.login;
    const password = req.body.password;

    try {
      assert.equal(login, process.env.ADMIN_LOGIN, '');
      assert.equal(password, process.env.ADMIN_PASSWORD, '');
    } catch (bodyError) {
      res.status(403).json({ error: true, message: "Wrong login or password" });
      return;
    }

    // success login
    const token = jwt.sign({ userId: 1, login: login }, jwtSecret, {
      expiresIn: 3000, //50 minutes
    });
    res.status(200).json({ token });
    return;
  }
}
