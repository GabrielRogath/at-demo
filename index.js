const express = require("express");
const bodyParser = require("body-parser");
// Set your app credentials
const credentials = {
  apiKey: "dd1f59821837d0c9864b0570905c7f5e1961be75d1dc06aca1020ebcc67af327",
  username: "acam-at-airtime",
};

// Initialize the SDK
const AfricasTalking = require("africastalking")(credentials);

// Get the SMS service
const sms = AfricasTalking.SMS;

function sendMessage(to, message) {
  const options = {
    // Set the numbers you want to send to in international format
    to: [to],
    // Set your message
    message: message,
  };

  // That’s it, hit send and we’ll take care of the rest
  sms.send(options).then(console.log).catch(console.log);
}

const port = process.env.PORT ?? 3000;

const recommendations = ["This is egg stage", "Medium larvae", "Mature larvae"];

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/ussd", (req, res) => {
  // Read the variables sent via POST from our API
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = "";

  if (text == "") {
    response = `CON Karibu mkulima je ungependa kutambua mdudu
        1. Ndio
        2. Hapana`;
  } else if (text == "1") {
    response = `CON Ingiza geresho la mdudu unae muona shambani mwako;`;
  } else if (text == "2") {
    response = `END Asante karibu tena`;
  } else if (text == "1*A" || text == "1*B" || text == "1*C") {
    response = `CON Ingiza geresho la pili la mdudu unae muona shambani mwako;`;
  } else if (
    text == "1*A*A" ||
    text == "1*A*B" ||
    text == "1*A*C" ||
    text == "1*B*A" ||
    text == "1*B*B" ||
    text == "1*B*C" ||
    text == "1*C*A" ||
    text == "1*C*B" ||
    text == "1*C*C"
  ) {
    let stage = 0;
    if (/C/.test(text)) {
      stage = 2;
    } else if (/B/.test(text)) {
      stage = 1;
    }
    response = `END Utapokea mapendekezo hivi punde??`;
    setTimeout(()=>{
      sendMessage(phoneNumber,recommendations[stage])
    },1000);
    
  }
  res.set("Content-Type: text/plain");
  res.send(response);
});

app.listen(port, () => {
  console.log(`listening ${port}`);
});
