import express from 'express';
const app = express();
import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();
const port = 3000;
app.use(express.json());
app.post('/user', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
});
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the users.' });
  }
});
app.post('/post', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: authorId },
        },
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});
app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true }
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the posts.' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
