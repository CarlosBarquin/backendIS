require("dotenv").config()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT;

const express = require('express')
const app = express()


const validGenders = ["male", "female", "unisex"];
const validTypes = ["clothing", "footwear", "accessories"];

app.use(cors());

app.get('/', (request, response) => {
    response.send('<h1>Servidor con</h1>')
})

app.use(bodyParser.json());


app.post('/api/addProduct', async (req, res) => {
  try {

    const { ID, name, img, description, price, gender, type } = req.body;

      if (!ID || !name || !img || !description || !price || !gender || !type) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
  
      if (!validGenders.includes(gender) || !validTypes.includes(type)) {
        return res.status(400).json({ error: 'Valores de gender o type no válidos' });
      }


    const db = await connectMongoDB();

    const collection = db.collection("PRODUCTOS");

    await collection.insertOne({
      ID,
      name,
      img,
      description,
      price,
      gender,
      type
    });

    res.status(201).json({ message: 'Producto añadido exitosamente' });
  } catch (error) {
    console.error("Error al añadir el producto:", error);
    res.status(500).json({ error: 'Error al añadir el producto' });
  }
});

app.get('/api/products', async (req, res) => {
    try {
      const db = await connectMongoDB();
      
      const collection = db.collection("PRODUCTOS");
      const data = await collection.find().toArray();
      
      res.json(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  });


  app.get('/api/products/:gender', async (req, res) => {
    try {
      const { gender } = req.params;
      const db = await connectMongoDB();
  
      const collection = db.collection("PRODUCTOS");
      const data = await collection.find({ gender }).toArray();
  
      res.json(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  });

  app.get('/api/productsT/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const db = await connectMongoDB();
  
      const collection = db.collection("PRODUCTOS");
      const data = await collection.find({ type }).toArray();
  
      res.json(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
  }
);
  
app.get('/api/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = require('mongodb');
    

    const db = await connectMongoDB();

    const collection = db.collection("PRODUCTOS");
    
  
    const data = await collection.findOne({ _id: new ObjectId(id) });

    if (!data) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(data);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: 'Error al obtener el producto' });
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