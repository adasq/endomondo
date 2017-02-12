const endomondo = require('../main.js');

if(!process.env.TEST_USER_PASSWORD) {
    throw 'set TEST_USER_PASSWORD in order to run tests';
}

const TEST_USER_EMAIL = 'asnaebaem@gmail.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
const TEST_USER_ID = 31848689;
const TEST_USER_FRIEND_ID = 20216809;

describe('endomondo API', () => {
    this.endoSession = null;
    beforeEach(() => {
        
    })
    describe('.authenticate()', () => {
        describe('using email / password', () => {
            it('return user info for correct credentials', (done) => {
                this.endoSession = endomondo.authenticate({
                    email: TEST_USER_EMAIL,
                    password: TEST_USER_PASSWORD
                }, (err, user) => {
                    expect(err).toBe(null);
                    expect(user.id).toBe(TEST_USER_ID);
                    expect(user.email).toBe(TEST_USER_EMAIL);

                    done();
                });
            });
            it('return error info for bad credentials', (done) => {
                const endoSession = endomondo.authenticate({
                    email: TEST_USER_EMAIL,
                    password: TEST_USER_PASSWORD + ' incorrect'
                }, (err, user) => {
                    expect(err.errors[0].code).toBe(3);
                    expect(user).not.toBeDefined();

                    done();
                });
            });
        });
    });

    describe('.friends()', () => {
        it('return friend list', (done) => {
            this.endoSession.friends((err, friends) => {
                expect(err).toBe(null);
                expect(friends[0].id).toBe(TEST_USER_FRIEND_ID);

                done();
            });
        })
    });
});

