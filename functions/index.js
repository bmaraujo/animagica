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
	console.log(`horario: ${JSON.stringify(horario)}`);
	const timeZoneOffset = '-03:00';
	const date = horario.split('T')[0];
	let time = 'T';
	
	if(horario.split('T')[1].includes('-')){
		time += horario.split('T')[1].split('-')[0];
	}
	else{
		time += horario.split('T')[1].split('+')[0];
	}
	const startDate = new Date(Date.parse(date + time + timeZoneOffset));
    const endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));
	shopCalendar = new Calendar();
	console.log(`marcar - start: ${startDate} - end: ${endDate}`);
	shopCalendar.createEvent(horario,endDate,summary);
	conv.ask('Ok, criado');
});

exports.TestProfiling = functions.https.onRequest(app);