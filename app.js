const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const port = process.env.PORT || 8000;

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");

var corsOptions = {
  origin: "https://foundation.travi-ci.com"
}

const app = express();
app.use(express.static("public"));
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/charge", (req, res) => {
  let amount = req.body.amount;

  stripe.customers.create({
    email: req.body.token.email,
    card: req.body.token.id
  }).then(customer =>
          stripe.charges.create({
            amount: amount,
            description: "Donate to Travis Foundation",
            currency: "eur",
            customer: customer.id
          }))
    .then(charge => res.send(charge))
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({error: "Purchase Failed"});
    });
});

app.get("/", (req, res) => {
  res.send("Hello, yes, this is working");
});

app.listen(port);
