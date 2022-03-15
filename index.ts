import express, { Application, json } from 'express';

const PORT = process.env.PORT || 4200;

const app: Application = express();

app.use(json());

app.get('/ping', async (_req, res) => {
  res.json({
    message: 'pong'
  });
});

export const server = app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
