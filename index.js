const { MongoClient } = require("mongodb");

let cachedClient = null;

const getClient = async () => {
  if (cachedClient) return cachedClient;
  cachedClient = new MongoClient(process.env.MONGODB_URI);
  await cachedClient.connect();
  return cachedClient;
};

exports.handler = async () => {
  const client = await getClient();
  const db = client.db(); // toma la BD del connection string

  const now = new Date();
  const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000); // próximas 24h

  const eventsCollection = db.collection("events");
  const registrationsCollection = db.collection("registrations");
  const notificationsCollection = db.collection("notifications");

  const upcomingEvents = await eventsCollection
    .find({
      status: "activo",
      date: { $gte: now, $lte: windowEnd }
    })
    .toArray();

  let created = 0;

  for (const event of upcomingEvents) {
    const registrations = await registrationsCollection
      .find({ event: event._id, status: "confirmada" })
      .toArray();

    for (const registration of registrations) {
      const alreadyExists = await notificationsCollection.findOne({
        user: registration.user,
        event: event._id,
        type: "recordatorio"
      });

      if (!alreadyExists) {
        await notificationsCollection.insertOne({
          user: registration.user,
          event: event._id,
          type: "recordatorio",
          message: `La actividad "${event.title}" está por comenzar.`,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        created++;
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ notificationsCreated: created })
  };
};