const express = require('express');
const app = express();
const PORT = 3000;
const admin = require("firebase-admin");
require("dotenv").config();
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }
    const newUserRef = db.ref('users').push();
    newUserRef.set({ name, email }, (error) => {
        if (error) {
            return res.status(500).send('Error saving user');
        } else {
            return res.status(201).send({ id: newUserRef.key, name, email });
        }
    });
});
app.get('/users', (req, res) => {
    db.ref('users').once('value', (snapshot) => {
        const users = snapshot.val();
        const userList = [];
        for (let id in users) {
            userList.push({ id, ...users[id] });
        }
        res.status(200).send(userList);
    }, (error) => {
        res.status(500).send('Error fetching users');
    });
}
);
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.ref(`users/${userId}`).once('value', (snapshot) => {
        const user = snapshot.val();
        if (user) {
            res.status(200).send({ id: userId, ...user });
        } else {
            res.status(404).send('User not found');
        }
    }, (error) => {
        res.status(500).send('Error fetching user');
    });
});
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.ref(`users/${userId}`).remove((error) => {
        if (error) {
            return res.status(500).send('Error deleting user');
        } else {
            return res.status(200).send('User deleted successfully');
        }
    });
});
const pollRef = db.ref('polls');
app.get("/poll", async (req, res) => {
  try {
    const snapshot = await pollRef.once("value");
    res.json(snapshot.val());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/vote", async (req, res) => {
  try {
    const { option } = req.body;
    if (!option) return res.status(400).json({ error: "Option is required" });
    const optionRef = pollRef.child(option);
    await optionRef.transaction((currentVotes) => {
      return (currentVotes || 0) + 1;
    });

    res.json({ message: "Vote recorded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
pollRef.on("value", (snapshot) => {
  console.log("Updated Poll Results:", snapshot.val());
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});