const { db, Option, Vote, Poll } = require("./models");

async function seed() {
  await db.sync({ force: true });

  const favoriteFoodPoll = await Poll.create({
    title: "What is the best food?",
    description: "A quick poll to see what food consumers like.",
  });

  const optionOne = await Option.create({
    text: "Pizza",
    pollId: favoriteFoodPoll.id,
  });

  const optionTwo = await Option.create({
    text: "Pasta",
    pollId: favoriteFoodPoll.id,
  });

  const optionThree = await Option.create({
    text: "Rice",
    pollId: favoriteFoodPoll.id,
  });

  await Vote.create({
    optionId: optionOne.id,
    pollId: favoriteFoodPoll.id,
    voterEmail: "alice@example.com",
  });
  await Vote.create({
    optionId: optionTwo.id,
    pollId: favoriteFoodPoll.id,
    voterEmail: "bob@example.com",
  });
  await Vote.create({
    optionId: optionThree.id,
    pollId: favoriteFoodPoll.id,
    voterEmail: "chris@example.com",
  });

  console.log("Seeded Successfully!");
  await db.close();
}

seed();
