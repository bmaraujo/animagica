'use strict'

const functions = require('firebase-functions');
const firebase = require('firebase');
const Calendar = require('./calendar');
const {
  dialogflow,
  BasicCard,
  Button,
  Suggestions,
  Permission,
} = require('actions-on-google');
const constDialogs = require('./dialogs');
const fs = require('fs');
const dialogs = JSON.parse(fs.readFileSync('./dialogs.json', 'utf8'));

const DAYS = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
const ACK = dialogs[constDialogs.ACK];
const CONFIRM_END = dialogs[constDialogs.CONFIRM_END];
const CONFIRM_SERVICE = dialogs[constDialogs.CONFIRM_SERVICE];
const CONFIRM_2SERVICES = dialogs[constDialogs.CONFIRM_2SERVICES];
const GET_MORE_INFO = dialogs[constDialogs.GET_MORE_INFO];

const app = dialogflow({debug: true});

function readJsonFile(filename){
		return JSON.parse(fs.readFileSync(filename, 'utf8'));
	}

function getRandomEntry(arr){
		return arr[Math.floor(Math.random() * arr.length)];
	}

function buildSpeech(message){
	let speech = '<speak>';
	speech += '<prosody rate="medium" pitch="+1st" volume="medium">';
	speech += message;
	speech += '</prosody>';
	speech += '</speak>';
	return speech
}

app.intent('marcarServico', (conv, {servico, servico2, animal, horario,dia}) =>{
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
	// let shopCalendar = new Calendar();
	console.log(`marcar - start: ${startDate} - end: ${endDate}`);
	// shopCalendar.createEvent(horario,endDate,summary);

	let response;
	if(servico2){
		response = getRandomEntry(ACK) + '<s>' 
			+ getRandomEntry(CONFIRM_2SERVICES).replace('$1',servico).replace('$5', servico2).replace('$2',animal).replace('$3',DAYS[startDate.getDay()]).replace('$4',startDate.getHours()-3)
			+ getRandomEntry(CONFIRM_END) + '</s>';
	}
	else{
		response = getRandomEntry(ACK) + '<s>' 
			+ getRandomEntry(CONFIRM_SERVICE).replace('$1',servico).replace('$2',animal).replace('$3',DAYS[startDate.getDay()]).replace('$4',startDate.getHours()-3)
			+ getRandomEntry(CONFIRM_END) + '</s>';
	}

	conv.ask(buildSpeech(response));
});

app.intent('marcarServico - yes', (conv) =>{
	const options = {
	    context: 'Para começar',
	    // Ask for more than one permission. User can authorize all or none.
	    permissions: ['NAME', 'DEVICE_COARSE_LOCATION'],
	  };
	  conv.ask(getRandomEntry(GET_MORE_INFO))
	  conv.ask(new Permission(options));
	// let shopCalendar = new Calendar();
	// shopCalendar.createEvent(horario,endDate,summary);	
});


console.log('Pronto');
exports.TestProfiling = functions.https.onRequest(app);