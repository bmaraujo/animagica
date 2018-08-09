function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
};

define('ACK','ACK');
define('CONFIRM_END','CONFIRM_END');
define('CONFIRM_SERVICE','CONFIRM_SERVICE');
define('CONFIRM_2SERVICES', 'CONFIRM_2SERVICES');
define('GET_MORE_INFO','GET_MORE_INFO');
