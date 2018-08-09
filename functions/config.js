'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
};

// suggestions
define('API_KEY', 'AIzaSyBExfsoVA_qyxUzJQj64C3ZPqBvBG6PLpk');
define('AUTH_DOMAIN','cervejacomque.firebaseapp.com');
define('DATABASE_URL','https://cervejacomque.firebaseio.com/');
define('STORAGE_BUCKET','cervejacomque.appspot.com');
define('FIREBASE_DB_USER','bruno.mourao.araujo@gmail.com');
define('FIREBASE_DB_PASS','teste123');
define('CALENDAR_ID','2o4pbsujdng9pu152ruhlg14ck@group.calendar.google.com');
define('CALENDAR_VERSION','v3');
define('SCOPES',['https://www.googleapis.com/auth/calendar']);
define('TOKEN_PATH','./credentials.json');
define('CLIENT_SCRT_PATH','./client_secret.json');