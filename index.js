const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/item", async (req, res) => {
  const items = await prisma.item.findMany()
  res.json(items);
});

app.get(`/item/:id`, async (req, res) => {
  const { id } = req.params;

  const post = await prisma.item.findUnique({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.post(`/item`, async (req, res) => {
  const { name, description, ownerId = 1 } = req.body;
  const result = await prisma.item.create({
    data: {
      name,
      description,
      owner: { connect: { id: ownerId } },
    },
  });
  res.json(result);
});

app.get("/givenoffer", async (req, res) => {

  // get from req MY ID
  const giverId = 1

  const givenOffers = await prisma.offer.findMany({
    where: { giverId: Number(giverId) },
    include: {
      giverItem: true,
      takerItem: true,
      taker: true
    }
  })

  res.json(givenOffers);
});

app.get("/givenoffer/:id", async (req, res) => {
  const { id } = req.params;

  // get from req MY ID
  const giverId = 1

  const givenOffers = await prisma.offer.findMany({
    where: { giverId: Number(giverId), id: Number(id)},
    include: {
      giverItem: true,
      takerItem: true,
      taker: true
    }
  })

  res.json(givenOffers);
});







app.post(`/signup`, async (req, res) => {
  const { name, email, posts } = req.body;

  const postData = posts
    ? posts.map((post) => {
        return { title: post.title, content: post.content || undefined };
      })
    : [];

  const result = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData,
      },
    },
  });
  res.json(result);
});

app.put("/post/:id/views", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` });
  }
});

app.put("/publish/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const postData = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    });

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData.published || undefined },
    });
    res.json(updatedPost);
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` });
  }
});

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(post);
});

app.post(`/users`, async (req, res) => {
  const { name, email } = req.body;

  const result = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  res.json(result);
});

app.get("/user/:id/drafts", async (req, res) => {
  const { id } = req.params;

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .posts({
      where: { published: false },
    });

  res.json(drafts);
});

app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.get("/feed", async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query;

  const or = searchString
    ? {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy || undefined,
    },
  });

  res.json(posts);
});

const port = process.env.PORT || 4000;

const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost: ${port}`)
);
