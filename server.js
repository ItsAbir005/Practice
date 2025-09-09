const express = require('express');
const app = express();
app.use(express.json());
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
app.post('/validate-email', (req, res) => {
  const { email } = req.body; // req.body is undefined without express.json()
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const valid = isValidEmail(email);
  res.json({ email, valid });
});
module.exports = { app, isValidEmail };
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
