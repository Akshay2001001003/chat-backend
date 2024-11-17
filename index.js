import express from "express";
import cors from "cors";
import { Product } from "./schema/product.js";
import { db } from "./connection/connection.js";
import bcrypt from "bcrypt";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./schema/message.js"; // Ensure this import exists

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send chat history to the newly connected client
  Message.find().then((messages) => {
    socket.emit("chat_history", messages);
  });

  // Listen for new messages from the client
  socket.on("send_message", async (message) => {
    console.log("Message received: ", message);

    // Save the message to the database
    const newMessage = new Message({ content: message });
    await newMessage.save();

    // Broadcast the message to all connected clients
    io.emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Sample POST endpoint for user registration
app.post("/sdhjkla", async (req, res, next) => {
  try {
    await db();
    const existingProduct = await Product.findOne({ email: req.body.email });
    if (existingProduct) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    // Create new product with the hashed password
    const prod = new Product({ ...req.body, password: hashedPassword });
    await prod.save();

    res.status(201).send(prod);
  } catch (error) {
    next(error);
  }
});

// Sample GET endpoint for login
app.get("/login/:email/:password", async (req, res, next) => {
  const { email, password } = req.params;
  try {
    await db();
    const user = await Product.findOne({ email: email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatch);
      if (isPasswordMatch) {
        return res.status(202).send({ message: "found", ok: true });
      }
    }
    return res.status(401).send({ message: "Invalid credentials" });
  } catch (e) {
    next(e);
  }
});

// Start the server
server.listen(4000, () => {
  db();
  console.log("Server running on http://localhost:4000");
});
