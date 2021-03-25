const { decodeBase64 } = require("bcryptjs");

module.exports = {
  dragonTreasure: async (req, res) => {
    const db = req.app.get('db');
    res.status(200).send(await db.get_dragon_treasure(1))
  },
  getUserTreasure: async (req, res) => {
    const db = req.app.get('db');
    res.status(200).send(await db.get_dragon_treasure(req.session.user.id))
  },
  addUserTreasure: async (req, res) => {
    const db = req.app.get('db');
    const { treasureURL } = req.body;
    const { id } = req.session.user;
    res.status(200).send(await db.add_user_treasure(treasureURL, id));
  },
  getAllTreasure: async (req, res) => {
    const db = req.app.get('db');
    res.status(200).send(await db.get_all_treasure())
  }
}