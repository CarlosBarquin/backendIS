require("dotenv").config()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT;

const express = require('express')
const app = express()

// Definir los valores permitidos para gender y type
const validGenders = ["male", "female", "unisex"];
const validTypes = ["clothing", "footwear", "accessories"];

app.use(cors());

app.get('/', (request, response) => {
    response.send('<h1>Servidor con</h1>')
})

app.use(bodyParser.json());

// Ruta para añadir un producto
app.post('/api/addProduct', async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { ID, name, img, description, price, gender, type } = req.body;

      // Validar que los campos requeridos estén presentes
      if (!ID || !name || !img || !description || !price || !gender || !type) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
  
      // Validar que gender y type sean valores permitidos
      if (!validGenders.includes(gender) || !validTypes.includes(type)) {
        return res.status(400).json({ error: 'Valores de gender o type no válidos' });
      }


    // Conectarse a la base de datos
    const db = await connectMongoDB();

    // Obtener la colección de productos
    const collection = db.collection("PRODUCTOS");

    // Insertar el nuevo producto en la colección
    await collection.insertOne({
      ID,
      name,
      img,
      description,
      price,
      gender,
      type
    });

    // Enviar una respuesta de éxito
    res.status(201).json({ message: 'Producto añadido exitosamente' });
  } catch (error) {
    console.error("Error al añadir el producto:", error);
    res.status(500).json({ error: 'Error al añadir el producto' });
  }
});

app.get('/api/products', async (req, res) => {
    try {
      // Conectarse a la base de datos
      const db = await connectMongoDB();
      
      // Obtener los datos de la colección
      const collection = db.collection("PRODUCTOS");
      const data = await collection.find().toArray();
      
      // Enviar los datos como respuesta
      res.json(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  });


  app.get('/api/products/:gender', async (req, res) => {
    try {
      const { gender } = req.params;
      // Conectarse a la base de datos
      const db = await connectMongoDB();
  
      // Obtener los datos de la colección
      const collection = db.collection("PRODUCTOS");
      const data = await collection.find({ gender }).toArray();
  
      // Enviar los datos como respuesta
      res.json(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  });

const { connectMongoDB } = require("./db/mongo.js");

(async () => {
  try {
    const db = await connectMongoDB();
    console.info(`MongoDB ${db.databaseName} connected`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
})();

app.listen(port, () => {
    console.log(`El servidor está levantado en el puerto ${port}`) 
})