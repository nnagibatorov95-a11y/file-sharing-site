const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Создаём папку uploads при запуске
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Файл не выбран');
  }

  const fileName = req.file.filename;
  const fileUrl = `/uploads/${fileName}`;

  res.send(`
    <html>
      <head>
        <title>Файл загружен</title>
        <style>
          body { font-family: Arial, sans-serif; background: linear-gradient(45deg, #ff8c00, #ff0000); color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          .container { background: rgba(0, 0, 0, 0.6); padding: 30px; border-radius: 10px; text-align: center; max-width: 500px; width: 90%; }
          a { color: #ffd700; text-decoration: none; font-weight: bold; }
          a:hover { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); }
        </style>
      </head>
      <body>
        <div class='container'>
          <h2>✅ Файл успешно загружен!</h2>
          <p>Ссылка для скачивания:</p>
          <a href="${fileUrl}" target="_blank">${fileUrl}</a>
          <br><br>
          <a href="/">Загрузить другой файл</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
