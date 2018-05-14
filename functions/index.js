const functions = require('firebase-functions');
const firebase = require('firebase');
const Calendar = require('./calendar');
const {
  dialogflow,
  BasicCard,
  Button,
  RegisterUpdate,
  Suggestions,
  UpdatePermission,
} = require('actions-on-google');
const app = dialogflow({debug: true});

app.intent('marcarServico', (conv, {servico, servico1, animal, horario,dia}) =>{
	let summary = servico + ' ' + animal;
	let startDate = new Date(horario);
	let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));
	shopCalendar = new Calendar();
	shopCalendar.createEvent(horario,endDate,summary);
	conv.ask('Ok, criado');
});

exports.TestProfiling = functions.https.onRequest(app);