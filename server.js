const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
app.use(express.json());

const kafka = new Kafka({
  clientId: "order-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();
const paymentConsumer = kafka.consumer({ groupId: "payment-service" });
const shippingConsumer = kafka.consumer({ groupId: "shipping-service" });

async function initKafka() {
  await producer.connect();

  await paymentConsumer.connect();
  await shippingConsumer.connect();

  await paymentConsumer.subscribe({ topic: "orders", fromBeginning: true });
  await shippingConsumer.subscribe({ topic: "orders", fromBeginning: true });

  // Payment Service
  paymentConsumer.run({
    eachMessage: async ({ message }) => {
      console.log(`💳 Payment Service: Processing -> ${message.value.toString()}`);
    },
  });

  // Shipping Service
  shippingConsumer.run({
    eachMessage: async ({ message }) => {
      console.log(`📦 Shipping Service: Shipping -> ${message.value.toString()}`);
    },
  });
}

// REST endpoint to place an order
app.post("/order", async (req, res) => {
  const order = {
    orderId: Date.now(),
    items: req.body.items || ["Book", "Laptop"],
  };

  await producer.send({
    topic: "orders",
    messages: [{ value: JSON.stringify(order) }],
  });

  console.log(`🛒 Order Placed: ${JSON.stringify(order)}`);
  res.json({ message: "Order placed successfully", order });
});

app.listen(3000, () => {
  console.log("🚀 Express server running on http://localhost:3000");
  initKafka().catch(console.error);
});
