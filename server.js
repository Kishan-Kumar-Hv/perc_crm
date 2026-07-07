import app from './api/server.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Local Express Server started via root server.js on http://localhost:${PORT}`);
});
