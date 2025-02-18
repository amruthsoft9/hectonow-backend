const getUser = (req, res) => {
    res.send("User details retrieved successfully!");
};

const updateUser = (req, res) => {
    res.send("User details updated successfully!");
};

module.exports = { getUser, updateUser };
