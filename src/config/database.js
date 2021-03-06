import mongoose from 'mongoose';

export function connectToDatabase(uri) {
  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) throw error;
      console.log('Connected to MongoDB');
    }
  );
}
