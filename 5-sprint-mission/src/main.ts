import app from './app';

const port = Number(process.env.SERVER_PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
