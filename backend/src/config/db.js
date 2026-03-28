import mongoose from "mongoose";
import dns from "node:dns";

// Força o Node a usar IPv4 primeiro (ajuda na conexão com o Atlas)
dns.setDefaultResultOrder("ipv4first");

export const connectDB = async () => {
  try {
    // Tentamos conectar usando a URL que está no .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🍃 MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar: ${error.message}`);
    process.exit(1); // Fecha o servidor se não conectar
  }
};