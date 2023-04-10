import app from 'app';
import logger from 'middleware/logger';

// Fix for nodemon crashes
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});

// Run the server!
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT);

logger.info(`Server running on port ${PORT}`);
