
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const configFile = require('./config');
const content = fs.readFileSync(configFile.CLIENT_SCRT_PATH);

const SCOPES = configFile.SCOPES;
const TOKEN_PATH = configFile.TOKEN_PATH;
const calendarId = configFile.CALENDAR_ID;

let dateTimeStart;
let dateTimeEnd;
let summary;
let eventId;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @return {function} if error in reading credentials.json asks for a new one.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  let token = {};
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  try {
    token = fs.readFileSync(TOKEN_PATH);
  } catch (err) {
    return getAccessToken(oAuth2Client, callback);
  }
  oAuth2Client.setCredentials(JSON.parse(token));
  callback(oAuth2Client);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
      } catch (err) {
        console.error(err);
      }
      callback(oAuth2Client);
    });
  });
}

function createCalendarEvent (auth) {
		const calendar = google.calendar({version: configFile.CALENDAR_VERSION, auth});
	  return new Promise((resolve, reject) => {
	    calendar.events.list({
	      auth: auth, // List events for time period
	      calendarId: calendarId,
	      timeMin: dateTimeStart.toISOString(),
	      timeMax: dateTimeEnd.toISOString()
	    }, (err, calendarResponse) => {
	      // Check if there is a event already on the Bike Shop Calendar
	      if (err || calendarResponse.data.items.length > 0) {
	        reject(err || new Error('Requested time conflicts with another appointment'));
	      } else {
	        // Create event for the requested time period
	        calendar.events.insert({ auth: auth,
	          calendarId: calendarId,
	          resource: {summary: summary,
	            start: {dateTime: dateTimeStart},
	            end: {dateTime: dateTimeEnd}}
	        }, (err, event) => {
	        	err ? reject(err) : resolve(event);
	        });
	      }
	    });
	  });
	}

function preCreateCalendarEvent(auth){
	createCalendarEvent(auth,dateTimeStart,dateTimeEnd,summary)
	.then(function (fulfilled){
		console.log(`Criado -> ${fulfilled.data.id} - ${fulfilled.data.start} - ${fulfilled.data.summary}`);
	})
	.catch(function (error){
		console.log("Erro => " + error);
	});
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEventsExecute(auth) {
  const calendar = google.calendar({version: configFile.CALENDAR_VERSION, auth});
  calendar.events.list({
    calendarId: calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${event.id} - ${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}

function deleteEventExecute(auth){
		const calendar = google.calendar({version: configFile.CALENDAR_VERSION, auth});
		calendar.events.delete({
			calendarId: calendarId,
			eventId: eventId
		}, (err, data) =>{
			if (err) return console.log('The API returned an error: ' + err);
			console.log(`Event ${eventId} deleted`);
		});
		
	}

class Calendar{

	
	createEvent(_dateTimeStart,_dateTimeEnd,_summary){
		try {
	  		dateTimeStart = _dateTimeStart;
	  		dateTimeEnd = _dateTimeEnd;
	  		summary = _summary;
	  		console.log(`Data: ${dateTimeStart}  - Fim: ${dateTimeEnd} - Summary: ${summary}`);
			authorize(JSON.parse(content), preCreateCalendarEvent);
		} catch (err) {
			return console.log('Error loading client secret file:', err);
		}
	}

	listEvents(){
		try {
			authorize(JSON.parse(content), listEventsExecute);
		} catch (err) {
			return console.log('Error loading client secret file:', err);
		}
	}
	


	deleteEvent(_eventId){
		try {
			eventId = _eventId;
			authorize(JSON.parse(content), deleteEventExecute);
		} catch (err) {
			return console.log('Error loading client secret file:', err);
		}
	}

}

module.exports = Calendar;