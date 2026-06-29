import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import { configureCloudinary } from './config/cloudinary';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Initialize external services
    await connectDB();
    configureCloudinary();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: Error) => {
      console.error('Unhandled Rejection:', reason.message);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();