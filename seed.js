// seed.js - Adds sample polls, options, and votes to the database.
const { db, Option, Vote, Poll } = require("./models");

  // Recreates the tables and removes existing data.
async function seed() {   
  await db.sync({ force: true });


  // Creates the food poll.
  const foodPoll = await Poll.create({
    title: "What is the best food?",
    description: "A quick poll to see what food consumers like.",
  });

  const [pizza, pasta, rice] = await Option.bulkCreate(
    [
      { text: "Pizza", pollId: foodPoll.id },
      { text: "Pasta", pollId: foodPoll.id },
      { text: "Rice", pollId: foodPoll.id },
    ],
    { returning: true }
  );

  await Vote.bulkCreate([
    { pollId: foodPoll.id, optionId: pizza.id, voterEmail: "ada@example.com" },
    { pollId: foodPoll.id, optionId: pizza.id, voterEmail: "linus@example.com" },
    { pollId: foodPoll.id, optionId: pasta.id, voterEmail: "grace@example.com" },
    { pollId: foodPoll.id, optionId: rice.id, voterEmail: "alan@example.com" },
  ]);

    // Creates the programming language poll.
  const langPoll = await Poll.create({
    title: "Favorite programming language?",
    description: "Vote for the language you reach for first.",
  });

  const [js, py, go] = await Option.bulkCreate(
    [
      { text: "JavaScript", pollId: langPoll.id },
      { text: "Python", pollId: langPoll.id },
      { text: "Go", pollId: langPoll.id },
    ],
    { returning: true }
  );

  await Vote.bulkCreate([
    { pollId: langPoll.id, optionId: js.id, voterEmail: "ada@example.com" },
    { pollId: langPoll.id, optionId: py.id, voterEmail: "grace@example.com" },
    { pollId: langPoll.id, optionId: py.id, voterEmail: "linus@example.com" },
    { pollId: langPoll.id, optionId: go.id, voterEmail: "alan@example.com" },
  ]);

  console.log("Seeded Successfully!");
  await db.close();
}

seed();
