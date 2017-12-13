
var iframe = document.querySelector('iframe'),
        player = new Vimeo.Player('made-in-ny', options),
        progress;

console.log(progress);

player.on('play', function () {
    console.log('played the video!');
});

function toggleTestButton() {
    console.log(progress);
    if (progress) {
        if (progress.percent.toString().substring(2) > 10) {
            $(".btn-info").show();
        }
    }
}

player.on('timeupdate', function (e) {
    if (typeof (e) === "object") {
        progress = e;
        toggleTestButton();
    }
});

setInterval(function () {
    checkStatus();
}, 5000);

$(window).bind('beforeunload', function (e) {
    checkStatus();
});

function checkStatus() {
    //ajax
}