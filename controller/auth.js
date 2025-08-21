const sendOTP = require('./mailer'); 
const redis = require('./redisClient'); 
const router = require('express').Router();

router.post('/signup', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        await redis.setex(`otp:${email}`, 300, otp);
        sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to your email!' });
    } catch (err) {
        console.error("Redis error:", err);
        res.status(500).json({ message: "Error generating OTP" });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        if (storedOtp === otp) {
            await redis.del(`otp:${email}`);
            return res.status(200).json({ message: "OTP verified successfully!" });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (err) {
        console.error("Redis error:", err);
        res.status(500).json({ message: "Error verifying OTP" });
    }
});

module.exports = router;