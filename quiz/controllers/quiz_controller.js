var models = require('../models/models.js');

// Autoload para rutas con parámetro quizId
exports.load = function(req, res,  next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe pregunta con id ' + quizId));
			}
		}
	).catch(function(error) {next(error);});
};

// GET /quizes/:quizId
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes
exports.index = function(req, res) {
	var options = {};
    
	if(req.query.search) {		
		options.where = ["pregunta like ?", "%" + req.query.search.replace(/\s/g, "%") + "%"];
	} 
	
	models.Quiz.findAll(options).then(
		function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes});
		})
};