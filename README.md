# endomondo

Endomondo API for nodejs.

## Get started
```js
$ npm i -s endomondo
```

```js
const endomondo = require('endomondo');
```

## Example usage


- using email
```js
const endo = require('endomondo');

const endoSession = endo.authenticate({
    email: 'email@domain.com',
    password: 'password'
}, (err, user) => {
    if(err) return console.log(err);

    console.log(user); // user information
    
    endoSession.feed((err, feed) => {
        if(err) return console.log(err);
        console.log(feed); // homepage's activity feed
    });
});
```
