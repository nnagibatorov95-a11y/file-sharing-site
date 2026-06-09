const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Статические файлы (главная страница)
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка загрузки файла
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Файл не выбран!');
  }

  const fileName = req.file.filename;
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

  res.send(`
    <h2>Файл успешно загружен!</h2>
    <p>Ссылка для скачивания:</p>
    <a href="${fileUrl}" target="_blank">${fileUrl}</a>
    <br><br>
    <a href="/">Загрузить другой файл</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});