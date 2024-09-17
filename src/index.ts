// src/index.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import userRoutes from './routes/user'; // Import user routes
import authRoutes from './routes/auth'; // Import auth routes
import API_V1 from './routes/v1'; // Import API v1 routes

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: "3.0.0", // Specify the OpenAPI version
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation for my Express app",
        },
    },
    apis: ["./src/routes/*.ts"], // Path to your API docs
};

// Initialize Swagger JSDoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));  // for serving static files
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api/v1', API_V1);

// Example route
/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to the API
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/', (req, res) => {
    res.send('Hello, API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});