var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar módulo ORM
var Sequelize = require('sequelize');

// Usar SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Comment en quiz.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Un comentario pertenece a una pregunta
Comment.belongsTo(Quiz);
// Una pregunta contiene n comentarios
Quiz.hasMany(Comment);

// Se exporta definición de tabla Quiz y Comment para poder importarla en otros módulos
exports.Quiz = Quiz;
exports.Comment = Comment;

// Crea e inicializa la tabla de preguntas de DB
sequelize.sync().success(function() {
	Quiz.count().success(function(count) {
		if (count === 0) {
			Quiz.create({pregunta: 'Capital de Italia',
						respuesta: 'Roma', tema: 'otro'
					});
			Quiz.create({pregunta: 'Capital de Portugal',
						respuesta: 'Lisboa', tema: 'otro'
					})
			.then(function(){ console.log('Base de datos inicializada...')});
		};
	});
});