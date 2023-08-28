const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const secretKey = 'secretKey';

//linki burada tanımladım
const downloadLink = "https://download-cdn.jetbrains.com/python/pycharm-professional-2023.2.exe";

// bu uygulama için bir kullanıcı yeterli
const users = [
  { id: 1, username: 'user', password: 'pass' },
 
];

// Kullanıcı girişi
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Username or password is wrong' });
  }

  const token = jwt.sign({ userId: user.id }, secretKey);
  res.json({ token });
});

// token kontrolünü burada yaptım
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Token bulunamadı' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token doğrulanamadı' });
    req.userId = decoded.userId;
    next();
  });
}

// download rotasına token kontrolünü ekledim
app.get('/download', authenticateToken, (req, res) => {
    const response = {
        downloadLink: downloadLink
      };
  res.json(response);
});

app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});
