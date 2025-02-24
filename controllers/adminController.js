const db = require("../config/db")

const path = require("path")


// fetch seller requests
 const fetchPendingSellers = (req, res) => {
    

    const query = "SELECT * FROM sellers WHERE approved = 0"; // ✅ Get pending sellers

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (!results || results.length === 0) {
            return res.status(200).json({ message: "No pending sellers found." }); 
        }

        res.status(200).json(results); 
    });
};

// Approval for sellers
 const approveSeller = (req, res) => {
    const sellerId = req.params.id;
    const query = "UPDATE sellers SET approved = 1 WHERE id = ?";
  
    db.query(query, [sellerId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Seller not found" });
      }
      res.status(200).json({ message: "Seller approved successfully" });
    });
  };
//  Reject Sellers
 const rejectSeller = (req, res) => {
    const { id } = req.params; 
    console.log("Seller ID received:", id);
    if (!id) {
        return res.status(400).json({ message: "Seller ID is required" });
    }

    const query = "UPDATE sellers SET approved = -1 WHERE id = ?";
    
    db.execute(query, [id], (err, result) => {
        if (err) {
            console.error("Error rejecting seller:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Seller not found" });
        }
        
      

        res.status(200).json({ message: "Seller rejected successfully" });
    });
};


module.exports = {fetchPendingSellers,approveSeller,rejectSeller}