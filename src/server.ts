import app from './app';
import logger from './logger';

// Run the server!
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT);

logger.info(`Server running on port ${PORT}`);
