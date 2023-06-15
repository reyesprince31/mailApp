import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import https from "https";

const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const { fullName, email } = req.body;
  console.log(fullName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fullName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url =
    "https://us21.api.mailchimp.com/3.0/lists/" + process.env.MAILCHIMP_LIST_ID;

  const options = {
    method: "POST",
    auth: "anystring:" + process.env.MAILCHIMP_API_KEY,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/" + "success.html");
    } else {
      res.sendFile(__dirname + "/" + "failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
