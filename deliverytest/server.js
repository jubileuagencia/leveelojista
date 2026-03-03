
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Security headers - Only use strict CSP in production
if (process.env.NODE_ENV === 'production') {
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    connectSrc: [
                        "'self'",
                        "https://qnvlzzprxgragohfwsnc.supabase.co",
                        "wss://qnvlzzprxgragohfwsnc.supabase.co",
                        "https://jubileuagencia.app.n8n.cloud"
                    ],
                    imgSrc: ["'self'", "data:", "https://qnvlzzprxgragohfwsnc.supabase.co", "https://images.unsplash.com"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                },
            },
        })
    );
}

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing: serve index.html for all non-API routes
// Using app.use() instead of app.get('*') to avoid path-to-regexp errors in newer Express versions
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
