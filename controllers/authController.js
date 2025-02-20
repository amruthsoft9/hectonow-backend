exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    res.status(200).json({ message: "Login successful", email });
};
