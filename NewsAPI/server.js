const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Thiết lập multer để lưu file ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Endpoint để tạo bài viết
app.post('/api/post/create', upload.single('image_url'), (req, res) => {
  const { title, content, author } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !content || !author || !image_url) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
  }
  app.get('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM post WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

  // Giả sử `db` là đối tượng kết nối với cơ sở dữ liệu của bạn
  db.insert({
    title,
    content,
    author,
    image_url: image_url,
    created_at: new Date()
  })
    .then(() => res.json({ message: 'Bài viết đã được đăng thành công!', image_url }))
    .catch(error => res.status(500).json({ message: 'Đăng bài thất bại. Vui lòng thử lại.' }));
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(5217, () => {
  console.log('Server: 5217');
});
