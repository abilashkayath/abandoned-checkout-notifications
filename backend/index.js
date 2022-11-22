const express = require("express");
const body_parser = require("body-parser");
const fetch = require("node-fetch");
const cron = require("node-cron");
const dayjs = require("dayjs");

const connectDB = require("./config/db");
const { sendMail, generateJobId } = require("./config/mailService");
const messageRoutes = require("./routes/messageRoutes");

const jobInterval = [
  { name: "first", time: 30, type: "hour" },
  { name: "second", time: 1, type: "day" },
  { name: "third", time: 3, type: "day" },
];

require("dotenv").config();

connectDB();

const app = express().use(body_parser.json());

const jobMap = new Map();
const abandonCheckoutMap = new Map();


app.use("/api/message", messageRoutes);

//webhook to catch cart creation
app.post("/shopify-webhook-cart-creation", function (req, res) {
  const items = getCheckoutDetails();
  items.map((item) => {
    const { id } = item;
    if (!abandonCheckoutMap.get(id)) {
      //add checkout item to Map
      abandonCheckoutMap.set(id, item);
      //scheduling 3 jobs(30 minutes, 1 day, 3 day after) for one abandoned checkout
      jobInterval.map((interval) => {
        const { name, time, type } = interval;
        const date = dayjs().add(time, type);

        const schedulerString = `${date.minute()} ${date.hour()} ${date.date()} ${date.month()} *`;
        setJob(`${generateJobId(id, name)}`, schedulerString);
      });
    }
  });
});

//webhook to catch order payment done, means order is succesfull
app.post("/shopify-webhook-order-payment", function (req, res) {
  const { checkout_id } = req.body;

  jobInterval.map(({ name }) => {
    //clearing scheduled jobs for this checkout id
    deleteJob(`${generateJobId(checkout_id, name)}`);
  });
});

async function getCheckoutDetails() {
  try {
    const response = await fetch(`${process.env.URL}/admin/api/2022-10/checkouts.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

function setJob(name, time) {
  const task = cron.schedule(time, function () {
    sendMail(item);
  });
  jobMap.set(name, task);
}

function deleteJob(name) {
  const job = jobMap.get(name);
  if (job) {
    job.stop();
  }
}

app.listen(8000, () => {
  console.log("webhook listening...");
});
