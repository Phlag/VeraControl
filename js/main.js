(function() {
    loadOptions();
    submitHandler();
})();

function submitHandler() {
    var $submitButton = $('#submit');

    $submitButton.on('click', function() {
        console.log('Submit');

        var return_to = getQueryParam('return_to', 'pebblejs://close#');
        document.location = return_to + encodeURIComponent(JSON.stringify(getAndStoreConfigData()));
    });
}

function loadOptions() {
    if (localStorage.username) {
        $('#username').val(localStorage.username);
    }
}

function getAndStoreConfigData() {
    var username = $('#username').val().toLowerCase();
    var password = $('#password').val();
    var password_seed = 'oZ7QE6LcLJp6fiWzdqZc';

    var options = {
        username: username,
        password: Sha1.hash( username + password + password_seed )
    };

    localStorage.username = options.username;
    localStorage.password = options.password;

    console.log('Got options: ' + JSON.stringify(options));
    return options;
}

function getQueryParam(variable, defaultValue) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return defaultValue || false;
}