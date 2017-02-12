# endomondo

Endomondo API for nodejs.

## Get started
```sh
$ npm install -S endomondo
```

```js
const endomondo = require('endomondo');
```

## Authenticate

- using email and password
```js
const endo = require('endomondo');

const endoSession = endo.authenticate({
    email: 'email@domain.com',
    password: 'password'
}, (err, user) => {
    if(err) return console.log(err);

    console.log(user); // user information
   
    //now you can use data endpoints, i.e.: endoSession.feed()
    //more below

});
```
## API usage
When session is established properly, you can use data edpoints.


### News feed
```js
endoSession.feed((err, feed) => {
    if(err) return console.log(err);
    console.log(feed); // homepage's activity feed
});
```

### Friends list
```js
endoSession.friends((err, friends) => {
    if(err) return console.log(err);
    console.log(friends); // friends list
});
```

## Test

```sh
$ npm test
```
