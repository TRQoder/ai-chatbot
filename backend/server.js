require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateAiResponse = require("./src/services/ai.services");

const PORT = process.env.PORT

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors : {
    origin:process.env.CLIENT_URL
  }
});

// const chatHistory = [
//   {
//     role : "user",
//     parts : [
//       {text : "hey my name is Tarique"}
//     ]
//   },
  
//   {
//     role : "model",
//     parts : [
//       {text : "Hi Tarique! Nice to meet you. I'm an AI assistant. How can I help you today?"}
//     ]
//   },
//   {
//     role : "user",
//     parts : [
//       {text : "My age is 21"}
//     ]
//   },
//    {
//     role : "model",
//     parts : [
//       {text : "ok i rem"}
//     ]
//   }
// ];

const chatHistory = []; 

io.on("connection", (socket) => {
  // ...
  // console.log("connected");

  socket.on("prompt", async (data) => {
    chatHistory.push({
      role : "user",
      parts : [{text : data}]
    })
    const res = await generateAiResponse(chatHistory);
    // console.log("user :", data);
    // console.log("ai :", res);
    socket.emit("ai-response", res);
    chatHistory.push({
      role : "model",
      parts : [{text :res }]
    })
  });

  socket.on("disconnect", () => {
    // console.log("disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT} `);
});
