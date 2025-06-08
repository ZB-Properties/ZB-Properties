const request = require('supertest');
const app = require('../index'); 

require('dotenv').config();

let token;
let propertyId;


describe('Real Estate API Tests', () => {
    // User Signup
    test('User can sign up', async () => {
        const uniqueEmail = `testuser${Math.random()}@example.com`;
      const res = await request(app)
          .post('/api/users/signup')
          .send({
              name: 'User test',
              email: uniqueEmail, // Ensure unique email
              password: 'passwords4'
          });
  
      if (res.statusCode !== 201) {
          console.error(res.body); // Log the error response
      }
  
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

    // User Signin
    test('User can sign in', async () => {
        const res = await request(app)
            .post('/api/users/signin')
            .send({
                email: 'testuser605@example.com',
                password: 'passwords4'
            });

            console.log("Response from server:", res.body); 

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token; // Save token for future requests

});

    // Post a new property
    test('User can post a new property', async () => {
      
        const res = await request(app)
            .post('/api/properties/post')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                title:"a 2 bedroom duplex",
                description:"2-bedroom duplex",
                price:1700000.00,
                location:"Festac town",
                type:"2 bedroom",
                image:"property34.jpeg"
                
            });
             
            console.log("Response from server:", res.body);    
             
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Property posted successfully');

        
        propertyId = res.body.id;
    });

    // Get all properties
    test('User can get all properties', async () => {
        const res = await request(app).get('/api/properties/all');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Get a specific property
    test('User can get a specific property', async () => {
        const res = await request(app).get(`/api/properties/45`);

        console.log("Response from server:", res.body);  

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(45);
    });

    // Update property details
    test('User can update property details', async () => {
        const res = await request(app)
            .put(`/api/properties/update/45`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                title:"a 1 bedroom duplex",
                description:"1-bedroom duplex",
                price:1900000.00,
                location:"Festac",
                type:"1 bedroom",
                status: 'updated'
            });

            console.log("Response from server:", res.body);  

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Property updated successfully');

        propertyId= res.body.id
    });

    // Mark property as sold
    test('User can mark a property as sold', async () => {
        const res = await request(app)
            .put(`/api/properties/sold/45`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Property marked as sold');
    });

    // Get properties by type
    test('User can get properties by type', async () => {
        const res = await request(app).get('/api/properties/type/2 bedroom');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Delete a property
    test('User can delete a property', async () => {
        const res = await request(app)
            .delete(`/api/properties/delete/56`)
            .set('Authorization', `Bearer ${token}`);

            console.log("Response from server:", res.body);  

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Property deleted successfully');
    });

});    
