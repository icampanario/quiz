var path = require('path');

// Cargar módulo ORM
var Sequelize = require('sequelize');

// Usar SQLite
var sequelize = new Sequelize(null, null, null,
							{dialect: 'sqlite', storage: 'quiz.sqlite'}
						);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Se exporta definición de tabla Quiz para poder importarla en otros módulos
exports.Quiz = Quiz;

// Crea e inicializa la tabla de preguntas de DB
sequelize.sync().success(function() {
	Quiz.count().success(function(count) {
		if (count === 0) {
			Quiz.create({pregunta: 'Capital de Roma',
						respuesta: 'Roma'
					}).success(function(){ console.log('Base de datos inicializada...')});
		};
	});
});