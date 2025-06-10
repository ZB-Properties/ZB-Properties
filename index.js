const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./Server/routes/userRoutes');
const propertyRoutes = require('./Server/routes/propertyRoutes');
const swaggerUi = require('swagger-ui-express');
const swagger = require('./swagger/swagger.json');

const path = require('path');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Create an account.html'));
});


const PORT = process.env.PORT || 8080;
 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});


module.exports = app;