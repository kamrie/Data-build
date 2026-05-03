import { db } from '../db.js';





export const test = (req, res) => {
    res.json({
         message: "Protected route working",
         user: req.user
    })
    
}






export const getWallet = (req, res) => {
  const userId = req.user.id;

  const query = "SELECT * FROM wallets WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.log("Wallet fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    return res.status(200).json({
      wallet: results[0],
    });
  });
};