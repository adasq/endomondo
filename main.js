const request = require('request').defaults({jar: true});
const pages = require('./src/pages/pages.js');

const BASE_URL = 'www.endomondo.com';
const HOME_URL = 'https://www.endomondo.com/home';
const LOGIN_URL = 'https://www.endomondo.com/rest/session';
const FEED_URL = 'https://www.endomondo.com/rest/v1/feeds/subscriptions?limit=20'
const FRIENDS_URL = 'https://www.endomondo.com/people/friends/';

function getCookieEntry(j, key){
    return j._jar.store.idx[BASE_URL]['/'][key].value
}

function friends(sessionRef, cb) {
    request({
        url: FRIENDS_URL,
        jar: sessionRef._cookie,
        headers: {
            'x-csrf-token': sessionRef.csrfToken
        }
    }, (err, response, body) => {
        if(err) return cb(err);
        const friendsList = pages.friends.getFriendsList(body);
        if(!friendsList) return cb(new Error('Problem while parsing friends page'));
        cb(null, friendsList);
    });    
}

function feed(sessionRef, cb){
    request({
        url: FEED_URL,
        json: true,
        jar: sessionRef._cookie,
        headers: {
            'x-csrf-token': sessionRef.csrfToken
        }
    }, (err, response, data) => {
        if(err) return cb(err);
        if(data.errors) return cb(data);
        cb(null, data.data);
    });
}

function authenticate({email, password}, cb){
    const cookie = request.jar();

    const sessionRef = {
        feed: (cb) => feed(sessionRef, cb),
        friends: (cb) => friends(sessionRef, cb),
        _cookie: cookie,
        authenticated: false,
        csrfToken: null
    };

    request.get({url: HOME_URL, jar: cookie}, (err, response, body) => {
        if(err)return cb(err);
        sessionRef.csrfToken = getCookieEntry(cookie, 'CSRF_TOKEN');
        
        const authData = {
            email,
            password,
            remember: true
        };
        const options = {
            url: LOGIN_URL,
            json: true,
            jar: sessionRef._cookie,
            method: 'POST',
            body: authData,
            headers: {
                'content-type': 'application/json;charset=UTF-8',
                'origin': 'https://www.endomondo.com',
                'pragma':'no-cache',
                'referer': 'https://www.endomondo.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
                'x-csrf-token': sessionRef.csrfToken
            }
        };

        request(options, (err, response, data) => {
            if(err)return cb(err);
            if(data.errors) return cb(data);

            sessionRef.authenticated = true;
            cb(null, data);
        });
    });

    return sessionRef;
}

module.exports = {
    authenticate
};