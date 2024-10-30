module.exports = {
    apps: [
      {
        name: 'api',                     // Name for your API service
        script: 'npx',                   // Command to run
        args: 'nx serve api --host=0.0.0.0', // Arguments for the `npx nx serve` command
        cwd: '.',                        // Root directory of your monorepo
        interpreter: 'none',             // Ensures `npx` runs directly without a Node interpreter
        env: {
          NODE_ENV: 'production',        // Environment variables if needed
        }
      },
      {
        name: 'web-society',             // Name for your web-society service
        script: 'npx',
        args: 'nx serve web-society --host=0.0.0.0',
        cwd: '.',
        interpreter: 'none',
        env: {
          NODE_ENV: 'production',
        }
      }
    ]
  };
  