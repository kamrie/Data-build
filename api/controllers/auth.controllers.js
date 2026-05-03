import bcryptjs from 'bcryptjs';
import jwt from  "jsonwebtoken";
import { db } from '../db.js';


export const signup = async (req, res, next) => {
    console.log(req.body) ;

       const {username, fname,email, phone, referralUsername, password} = req.body;
       console.log('Signup details:', req.body); // Debugging

          // Check if username or email already exists
         const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";

          db.query(checkQuery, [username, email], (err, results) => {
            if (err) {
                console.log("Check user error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length > 0) {
                let message = "";

                if (results[0].username === username) {
                    message = "Username already exists";
                } else if (results[0].email === email) {
                    message = "Email already exists";
                }

                return res.status(400).json({ message });
                }
       
           
            // Make referralUsername optional
            const referralUser = referralUsername || null; // If empty, set to null
            // Hash password
            const hashedPassword = bcryptjs.hashSync(password, 10);
            // Insert user
        const insertQuery = `
        INSERT INTO users (username, fname, email, phone, password, referral_username)
        VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
        insertQuery,
        [username, fname, email, phone, hashedPassword, referralUsername || null],
        (err, result) => {
            if (err) {
            console.log("Insert error:", err);
            return res.status(500).json({ message: "Database error" });
            }

          const userId = result.insertId; //get new user ID
           console.log("New user ID:", userId);

          //  Create wallet
            const walletQuery = `
              INSERT INTO wallets (user_id, balance)
              VALUES (?, 0)
            `;
              
             db.query(walletQuery, [userId], (walletErr, walletResult) => {
                if (walletErr) {
                  console.log("Wallet creation error:", walletErr);
                  return res.status(500).json({ message: "Wallet creation failed" });
                }

                console.log("Wallet created:", walletResult);
          
              return res.status(201).json({
                message: "Registration successful ✅",
            });
      });
  });
})
}

      
        // Send error response
        // res.status(500).json({
        //     message: 'Internal server error. Please try again.',
        // });

    // Handle duplicate key error
        //  if (error.code === 11000) {
        //     return res.status(400).json({
        //         message: 'Username or email already exists.',
        //     });
        // }

    

export const signin = (req, res) => {
  const { username, password } = req.body;

  console.log('Login details:', req.body);

   const query = "SELECT * FROM users WHERE username = ?";  //returns an array of rows  eg results =
// [
//   {
//     id: 1,
//     username: "chibuz",
//     email: "ifedikeze@gmail.com",
//     password: "hashed_password_here"
//   }
//   ]

  db.query(query, [username], (err, results) => {
    if (err) {
      console.log("Login error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    //  No user found
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong credentials" });
    }
    // Create token
    const token = jwt.sign(
      { id: user.id },   // ✅ MySQL uses id (not _id)
      process.env.JWT_SECRET
    );
    // Remove password
    const { password: pass, ...rest } = user;

    // Send cookie
    res
      .cookie('access_token', token, { httpOnly: true, sameSite: "lax", secure: false })
      .status(200)
      .json(rest);
  });
};