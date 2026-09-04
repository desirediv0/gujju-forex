import { createServer } from 'http';
import next from 'next';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 7018;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        createServer(async (req, res) => {
            if (req.url.startsWith("/api/auth/")) {
                return handle(req, res);
            }
            handle(req, res);
        }).listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Error starting server:', err);
        process.exit(1);
    });
