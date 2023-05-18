const { MongoClient, ObjectId } = require("mongodb");

const MONGODB_URI = "mongodb://localhost:27017";
const DB_NAME = "chat_db";

async function updateUserStatus(userId, status) {
  console.log(userId, status);
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  try {
    const collection = db.collection("users");

    await collection.updateOne(
      { _id: new ObjectId(userId) }, // Converter para ObjectId
      { $set: { status: status } }
    );

    console.log("Estado do usuário atualizado:", userId, status);
  } catch (error) {
    console.error("Erro ao atualizar o estado do usuário:", error);
  } finally {
    client.close();
  }
}

module.exports = {
  updateUserStatus,
};
