import mongoose from 'mongoose';

// MongoDB connection string - should be set as environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://myAtlasDBUser:rj13sl1608@cluster0.whgoitb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Define Mongoose schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isVerified: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date }
});

const TodoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  dueDate: { type: Date },
  tags: { type: [String], default: [] },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  notes: { type: String },
  reminder: { type: Date }
});

// Add indexes
UserSchema.index({ username: 1 });
TodoSchema.index({ userId: 1, createdAt: -1 });

// Global variables to maintain connection state
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Create models
async function getModels() {
  const conn = await connectToDatabase();
  
  // Check if models already exist
  const User = conn.models.User || conn.model('User', UserSchema);
  const Todo = conn.models.Todo || conn.model('Todo', TodoSchema);
  
  return { User, Todo };
}

export { connectToDatabase, getModels };