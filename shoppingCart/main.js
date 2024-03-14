const http = require('http');
const { MongoClient } = require('mongodb');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

const MONGODB_URI = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const PORT = 3000;

class Item {
  constructor(name, price, quantity, image) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.image = image;
  }
}

class ShoppingCart {
  constructor() {
    this.cart = [];
  }

  async initDB() {
    this.client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });

    try {
      await this.client.connect();
      this.db = this.client.db('shoppingCartDB');
      this.cartCollection = this.db.collection('cart');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  async closeDB() {
    await this.client.close();
  }

  async addItem(itemData, imageFile) {
    const existingItem = await this.cartCollection.findOne({ name: itemData.name });

    if (existingItem) {
        const quantityToAdd = parseInt(itemData.quantity,10);
        console.log(quantityToAdd)
        if (!isNaN(quantityToAdd)) {
            await this.cartCollection.updateOne(
                { name: itemData.name },
                { $inc: { quantity: quantityToAdd} }
          );
          console.log(`${quantityToAdd} ${itemData.name}(s) added to the cart.`);
        } else {
            console.error('Invalid quantity:', itemData.quantity);
        }
        
    } else {
      const newItem = new Item(itemData.name, itemData.price, itemData.quantity, imageFile);
      await this.cartCollection.insertOne(newItem);
    }

    console.log(`${itemData.quantity} ${itemData.name}(s) added to the cart.`);
  }

  async viewCart(res) {
    const cartItems = await this.cartCollection.find().toArray();

    if (cartItems.length === 0) {
      res.write('Your cart is empty.');
    } else {
      res.write('Cart Contents:\n');
      cartItems.forEach((item) => {
        res.write(`${item.quantity} ${item.name}(s) - $${item.price * item.quantity}\n`);
      });
    }
    res.end();
  }

  async calculateTotal(res) {
    const cartItems = await this.cartCollection.find().toArray();
    let total = 0;

    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });

    res.write(`Total Price: $${total}`);
    res.end();
  }
}

const shoppingCart = new ShoppingCart();

const server = http.createServer(async (req, res) => {
    cors()(req, res, () => {});
  if (req.method === 'POST' && req.url === '/add') {
    if (req.headers['content-type'].includes('multipart/form-data')) {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form data:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('Internal Server Error');
          res.end();
          return;
        }

        try {
          await shoppingCart.initDB();
          await shoppingCart.addItem(fields, files.image);
          shoppingCart.closeDB();

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.write('Item added to the cart.');
          res.end();
        } catch (error) {
          console.error('Error:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('Internal Server Error');
          res.end();
        }
      });
    } else {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const data = JSON.parse(body);

          await shoppingCart.initDB();
          await shoppingCart.addItem(data, null);
          shoppingCart.closeDB();

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.write('Item added to the cart.');
          res.end();
        } catch (error) {
          console.error('Error:', error);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.write('Bad Request');
          res.end();
        }
      });
    }
  } else if (req.method === 'GET' && req.url === '/view') {
    await shoppingCart.initDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    await shoppingCart.viewCart(res);
    shoppingCart.closeDB();
  } else if (req.method === 'GET' && req.url === '/total') {
    await shoppingCart.initDB();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    await shoppingCart.calculateTotal(res);
    shoppingCart.closeDB();
  } else if (req.method === 'GET' && req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    const fileStream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fileStream.pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Not Found');
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
