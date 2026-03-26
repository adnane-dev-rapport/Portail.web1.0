import serverless from 'serverless-http';
import { createServer } from '../dist/server/node-build.mjs';

const app = createServer();

export default serverless(app);
