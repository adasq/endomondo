const cheerio = require('cheerio');
const _ = require('underscore');

function getProfileIdByProfileUrl(profileUrl){
    return +profileUrl.match(/[0-9]+/)[0];
}

function getFriendsList(body){
    let friends;
    try {
        const $ = cheerio.load(body);
        const friendsList = $('.friends').find('.user');
        friends = _.map(friendsList, (elem, i) => {

            const aElem = friendsList.eq(i).find('a');
            const countryElem = friendsList.eq(i).find('.country');
            const thumbnailElem = aElem.find('.thumbnail');

            const country = countryElem.text();
            const description = countryElem.eq(0).next().text();
            const id = getProfileIdByProfileUrl(aElem.attr('href'));
            const name = aElem.attr('title');
            const thumbnail = thumbnailElem.attr('src');

            return {id, name, country, description, thumbnail};
        });
    }catch(e){
        return null;
    }
    return friends;
}



module.exports = {
    getFriendsList
};