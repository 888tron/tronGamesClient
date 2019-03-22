function Countdown(id, endtime) {
	var timer = document.getElementById(id);
	var daysSpan = timer.querySelector('.days');
	var hoursSpan = timer.querySelector('.hours');
	var minutesSpan = timer.querySelector('.minutes');
	var secondsSpan = timer.querySelector('.seconds');

	function updatetimer() {

		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor((t / 1000) % 60);
		var minutes = Math.floor((t / 1000 / 60) % 60);
		var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
		var days = Math.floor(t / (1000 * 60 * 60 * 24));

		daysSpan.innerHTML = days;
		hoursSpan.innerHTML = ('0' + hours).slice(-2);
		minutesSpan.innerHTML = ('0' + minutes).slice(-2);
		secondsSpan.innerHTML = ('0' + seconds).slice(-2);

		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}

	updatetimer();
	var timeinterval = setInterval(updatetimer, 1000);
}

var end = new Date();
end.setUTCFullYear(2019);
end.setUTCMonth(3, 1);
end.setUTCDate(9);
end.setUTCHours(15);
end.setUTCMinutes(00);
end.setUTCSeconds(00);

Countdown('timer', end);