const { sequelize } = require('../models');

try {
    sequelize.authenticate();
    console.log('Database connected !');
} catch (error) {
    console.log('An error accurs to database: ' + error);
}