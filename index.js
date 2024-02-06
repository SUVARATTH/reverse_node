const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
app.use(bodyParser.json());
const crypto = require('crypto');

// const bodyParser = require('body-parser')

app.use(bodyParser.json());
const x = require('./routes/routes')
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', (req, res) => {
    res.render('home')
})

function encryptData(data, secretKey) {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData };
}

function decryptData(encryptedData, secretKey) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), Buffer.alloc(16, 0));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return JSON.parse(decryptedData);
}

const secretKey = crypto.randomBytes(32).toString('hex'); // Replace with your secret key

// Data to encrypt
const dataToEncrypt = {
    name: 'John Doe',
    age: 30,
    city: 'New York'
};

// Encrypt the data
const encryptedData = encryptData(dataToEncrypt, secretKey);
console.log('Encrypted Data:', encryptedData);

// Decrypt the data
const decryptedData = decryptData(encryptedData, secretKey);
console.log('Decrypted Data:', decryptedData);
app.post('/login', (req, res) => {
    const encryptedFormData = req.body.encryptedFormData;
    console.log(encryptedFormData)
    const secretKey = '12345'; // Replace with your secret key

    // Decrypt the data
    const decryptedData = decryptData(encryptedFormData, secretKey);

    console.log('Decrypted Data:', decryptedData);

    // Process the decrypted data as needed

    res.status(200).json({ message: 'Encrypted data received and decrypted successfully' });
});

app.listen(3000)































// 



// function decryptData(encryptedData, secretKey) {
//     const decryptedBytes = crypto.AES.decrypt(encryptedData, secretKey);
//     const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
//     return decryptedData;
// }