const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./Server/routes/userRoutes');
const propertyRoutes = require('./Server/routes/propertyRoutes');
const swaggerUi = require('swagger-ui-express');
const swagger = require('./swagger/swagger.json');


dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://zb-properties.github.io/ZB-Properties/Client-side/Create an account.html', 
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Handle preflight OPTIONS
app.options('*', cors());

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});



const PORT = process.env.PORT || 7700;
 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;