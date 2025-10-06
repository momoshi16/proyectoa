import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*', // permite peticiones desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

  // Crear pool de conexiones a MySQL
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

// Verificar conexión
pool.getConnection()
  .then(conn => {
    console.log("✅ Conectado a MySQL (control_asistencia)");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error de conexión a MySQL:", err);
  });

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});
// Ruta para verificar login
app.post('/login', async (req, res) => {
  try {
    const { correo, pass } = req.body;

    // Verificar que se enviaron los datos
    if (!correo || !pass) {
      return res.status(400).json({ message: 'Faltan datos: correo o contraseña.' });
    }

    // Buscar usuario con ese correo
    const [rows] = await pool.query('SELECT correo, pass, nombre FROM usuarios WHERE correo = ?', [correo]);
    // Si no existe el usuario
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    const usuario = rows[0];

    // Verificar contraseña (texto plano; recomendable usar bcrypt)
    if (usuario.pass !== pass) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Credenciales correctas → enviamos correo y nombre
    res.json({ message: 'Login exitoso', usuario: { correo: usuario.correo, nombre: usuario.nombre } });

  } catch (error) {
    console.error('Error al verificar login:', error);
    res.status(500).json({ message: 'Error en el servidor al verificar login.' });
  }
});
app.get('/usuarios', async (req, res) => {
  try {
    // Consulta para traer nombre, correo, matricula, grado y tipo de usuario
    const [rows] = await pool.query(`
      SELECT 
        u.nombre, 
        u.correo, 
        u.matricula, 
        u.grado, 
        t.nombre AS tipo_usuario
      FROM usuarios u
      JOIN tipos_usuario t ON u.tipo_id = t.id
    `);

    res.json({ usuarios: rows });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener usuarios.' });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, correo, matricula, grado, tipo_usuario } = req.body;

    // Validar campos mínimos
    if (!nombre || !tipo_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Buscar el id del tipo de usuario
    const [tipos] = await pool.query('SELECT id FROM tipos_usuario WHERE nombre = ?', [tipo_usuario]);
    if (tipos.length === 0) {
      return res.status(400).json({ message: 'Tipo de usuario no válido' });
    }
    const tipo_id = tipos[0].id;

    // Verificar si el usuario ya existe (por nombre o correo único, se puede cambiar)
    const [usuarios] = await pool.query('SELECT id FROM usuarios WHERE nombre = ? OR correo = ?', [nombre, correo]);
    
    if (usuarios.length > 0) {
      // Actualizar usuario existente
      await pool.query(
        `UPDATE usuarios SET correo = ?, matricula = ?, grado = ?, tipo_id = ? WHERE id = ?`, 
        [correo, matricula, grado, tipo_id, usuarios[0].id]
      );
      return res.json({ message: 'Usuario actualizado correctamente' });
    } else {
      // Insertar nuevo usuario
      await pool.query(
        `INSERT INTO usuarios (nombre, correo, matricula, grado, tipo_id) VALUES (?, ?, ?, ?, ?)`,
        [nombre, correo, matricula, grado, tipo_id]
      );
      return res.json({ message: 'Usuario creado correctamente' });
    }
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor al guardar usuario' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://192.168.1.254:${PORT}`);
});