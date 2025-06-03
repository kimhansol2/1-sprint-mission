module.exports = {
  apps: [
    {
      name: 'mission10',
      script: 'npx',
      args: 'ts-node src/main.ts',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
