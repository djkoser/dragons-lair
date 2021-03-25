const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const db = req.app.get('db');
    const [existingUser] = await db.get_user(username);

    if (existingUser) {
      return res.status(409).send('Username taken');
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const [user] = await db.register_user(isAdmin, username, hash);
      req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id };
      res.status(201).send(req.session.user);
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');
    const [user] = await db.get_user(username);
    if (!user) {
      res.status(401).send('User Not Found, Please Register as a New User Before Logging In. ');
    } else {
      const isAuthenticated = bcrypt.compareSync(password, user.hash);
      if (!isAuthenticated) {
        res.status(403).send('Incorrect Password');
      } else {
        req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id };
        res.status(200).send(req.session.user);
      }
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  }
}