const axios = require('axios');
require('dotenv').config();

exports.getFrcMatchGambling = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/frcMatchGambling`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.get

