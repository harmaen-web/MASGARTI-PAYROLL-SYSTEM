import mongoose from 'mongoose';

export const mountDbViewer = (app) => {
  app.get('/db-viewer', async (_req, res) => {
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const data = {};

      for (const collection of collections) {
        data[collection.name] = await db.collection(collection.name).find({}).toArray();
      }

      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Masgarti Payroll - MongoDB Viewer</title>
            <style>
              body { font-family: Inter, Arial, sans-serif; margin: 24px; background: #f1f5f9; color: #0f172a; }
              h1 { margin-bottom: 8px; }
              p { color: #475569; }
              .card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-top: 20px; }
              h2 { margin-top: 0; }
              pre { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 12px; overflow: auto; }
              .meta { font-size: 14px; color: #64748b; }
            </style>
          </head>
          <body>
            <h1>MongoDB Data Viewer</h1>
            <p class="meta">Database: <strong>${db.databaseName}</strong> | Connection: <strong>mongodb://127.0.0.1:27017/${db.databaseName}</strong></p>
            ${collections
              .map(
                (collection) => `
                  <div class="card">
                    <h2>${collection.name}</h2>
                    <p class="meta">${data[collection.name].length} document(s)</p>
                    <pre>${JSON.stringify(data[collection.name], null, 2)}</pre>
                  </div>
                `
              )
              .join('')}
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send(`<h1>Failed to load database</h1><pre>${error.message}</pre>`);
    }
  });
};
