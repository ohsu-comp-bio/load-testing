module.exports = {
    EMAIL: '',
    PASSWORD: ''
}

if (`${__ENV.EMAIL}`) {
    module.exports.EMAIL = `${__ENV.EMAIL}`;
}
if (`${__ENV.PASSWORD}`) {
    module.exports.PASSWORD = `${__ENV.PASSWORD}`;
}
