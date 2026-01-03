import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elevator-quote';

async function startServer() {
  // Connect to MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }

  const app = express();
  const httpServer = createServer(app);

  // WebSocket Server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');
    
    ws.on('message', (message) => {
      console.log('📨 Received:', message.toString());
    });
    
    ws.on('close', () => {
      console.log('🔌 WebSocket client disconnected');
    });
  });

  // Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // Middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }));
  
  app.use(express.json());

  // Health check
  app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GraphQL endpoint
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => ({
      // Add context here (auth, etc.)
    }),
  }));

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL at http://localhost:${PORT}/graphql`);
    console.log(`🔌 WebSocket at ws://localhost:${PORT}/ws`);
  });
}

startServer().catch(console.error);
