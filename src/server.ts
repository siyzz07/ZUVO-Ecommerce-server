import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './api/routes/AuthRoutes';
import productRoutes from './api/routes/ProductRoutes';
import shopRoutes from './api/routes/ShopRoutes';
import uploadRoutes from './api/routes/UploadRoutes';
import categoryRoutes from './api/routes/CategoryRoutes';
import { connectDB } from './config/db';
import logger from './config/logger';
import User from './core/entities/User';
import Product from './core/entities/Product';
import ShopSettings from './core/entities/ShopSettings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : [];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(compression());

// HTTP Request Logging (Morgan + Winston)
const morganFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));

// Initialize Database & Seeding
const initializeApp = async () => {
    try {
        // 1. Connect to Database
        await connectDB();

        // 2. Seed Default Admin from Environment Variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin123@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || '1234567';
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            const admin = new User({
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            logger.info(`👤 Authorized Admin Created: ${adminEmail}`);
        }

        // 3. Seed Sample Products
        const productsCount = await Product.countDocuments();
        if (productsCount === 0) {
            const samples = [
                {
                    name: 'K9 Wireless Pro Microphone',
                    price: 1899,
                    originalPrice: 2499,
                    images: [
                        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1590603172817-2c527418706e?q=80&w=600&auto=format&fit=crop'
                    ],
                    category: 'Audio',
                    description: 'Professional noise cancelling wireless microphone for creators.'
                }
            ];
            await Product.insertMany(samples);
            logger.info('📦 Inventory Initialized with Sample Stock');
        }

        // 4. Seed Shop Settings
        let settings = await ShopSettings.findOne();
        if (!settings) {
            settings = new ShopSettings({
                shopName: 'ZUVO Mobile Hub',
                description: 'Premium Gadget Store. High performance gadgets for the modern lifestyle.',
                address: '123 Premium Street, Hub Lane, Gadget City, India',
                phone: '+91 98765 43210',
                email: 'support@zuvo.com',
                profilePic: '/zuvo_logo.png',
                coverPhotos: ['/zuvo_cover.png', '/zuvo_cover_2.png'],
                location: { lat: 28.6139, lng: 77.2090 }
            });
            await settings.save();
            logger.info('🏢 Shop Settings Initialized with Default Details and Banners');
        } else {
            let updated = false;
            if (!settings.profilePic) {
                settings.profilePic = '/zuvo_logo.png';
                updated = true;
            }
            if (!settings.coverPhotos || settings.coverPhotos.length === 0) {
                settings.coverPhotos = ['/zuvo_cover.png', '/zuvo_cover_2.png'];
                updated = true;
            }
            if (updated) {
                await settings.save();
                logger.info('🏢 Existing Shop Settings Updated with Default Banners/Logo');
            }
        }
    } catch (error: any) {
        logger.error(`❌ Initialization Error: ${error.message}`);
    }
};

initializeApp();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);

// Base Route
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('ZUVO API is running...');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 System Online: Server running on port ${PORT}`);
});
