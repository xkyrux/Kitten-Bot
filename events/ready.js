  
module.exports = client => {
    console.log('LETS KINK IT UP MOTHERFUCKER!');

    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'with daddy uwu',
            type: 'PLAYING'
        }
    });
};