import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

const PORT = 8080; // Use correct variable name 'PORT'

/** HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});

/** api routes */
app.use('/api', router)

/** start server only when we have a valid connection */
connect().then(() => {
    try {
        app.listen(PORT, () => { // Use 'PORT' here
            console.log(`Server connected to http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log('Cannot start the server', error);
    }
}).catch(error => {
    console.log("Invalid database connection...!", error);
});
