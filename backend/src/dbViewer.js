import mongoose from 'mongoose';

const redactDocument = (document) => {
  const copy = { ...document };
  if (copy.password) copy.password = '[redacted]';
  return copy;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const mountDbViewer = (app, authMiddleware) => {
  app.get('/db-viewer', authMiddleware, async (_req, res) => {
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const data = {};

      for (const collection of collections) {
        const documents = await db.collection(collection.name).find({}).toArray();
        data[collection.name] = documents.map(redactDocument);
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
            <p class="meta">Database: <strong>${escapeHtml(db.databaseName)}</strong></p>
            ${collections
              .map(
                (collection) => `
                  <div class="card">
                    <h2>${escapeHtml(collection.name)}</h2>
                    <p class="meta">${data[collection.name].length} document(s)</p>
                    <pre>${escapeHtml(JSON.stringify(data[collection.name], null, 2))}</pre>
                  </div>
                `
              )
              .join('')}
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send(`<h1>Failed to load database</h1><pre>${escapeHtml(error.message)}</pre>`);
    }
  });
};
