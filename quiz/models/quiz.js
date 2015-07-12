module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz',
			{ pregunta:  {
				type: DataTypes.STRING,
				validate: { notEmpty: { msg: "-> La pregunta no puede ser vacía"}}
			},
			  respuesta: {
			  	type: DataTypes.STRING,
			  	validate: { notEmpty: { msg: "-> La respuesta no puede ser vacía"}}
			  }
			});
}