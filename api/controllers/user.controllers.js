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


export const fundWallet = (req, res) => {
        const userId = req.user.id;
        const { amount } = req.body;

        // Basic validation
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const query = `
            UPDATE wallets 
            SET balance = balance + ? 
            WHERE user_id = ?
        `;

        db.query(query, [amount, userId], (err, result) => {
            if (err) {
            console.log("Fund wallet error:", err);
            return res.status(500).json({ message: "Database error" });
            }

            return res.status(200).json({
            message: "Wallet funded successfully !!!",
            });
        });
};