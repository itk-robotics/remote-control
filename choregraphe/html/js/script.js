;(function() {
		var log = function(message) {
				document.getElementById('output').value += message + '\n';
		}

		// keeping a pointer to the session is very useful!
var session;

try {
  QiSession(function (s) {
    console.log('connected!');
    session = s;

		session.service('ALMemory').then(function (memory) {
      memory.subscriber('FrontTactilTouched').then(function (subscriber) {
					subscriber.signal.connect(function (state) {
							log('FrontTactilTouched: ' + state);
						console.log(state == 1 ? "You just touched my head!" : "Bye bye!");
				});
      });

				memory.subscriber('remote-control/time').then(function (subscriber) {
						subscriber.signal.connect(function (value) {
								document.getElementById('time').innerHTML = value[3] + ':' + value[4] + ':' + value[5];
						});
				});
    });

			var sayMe = function() {
					var text = this.value ? this.value : this.innerHTML;
					session.service('ALAnimatedSpeech').then(function (tts) {
							;;; log(text);
							tts.say(text);
					}, function (error) {
							console.log(error);
					})
			};

			[].slice.call(document.querySelectorAll('button.speech')).forEach(function(button, index) {
					button.addEventListener('click', sayMe);
			});

			var moveRobot = function() {
					var value = this.value ? this.value : this.innerHTML;
					session.service('ALMotion').then(function (motion) {
							var x = 0;
							var y = 0;
							var theta = 0;
							switch (value) {
							case 'stop':
									motion.stopMove();
									return;
							case 'turn left':
									theta = Math.PI / 2;
									break;
							case 'turn right':
									theta = -Math.PI / 2;
									break;
							case 'forward':
									x = 1;
									break;
							case 'left':
									y = 1;
									theta = Math.PI / 2;
									break;
							case 'right':
									y = -1;
									theta = -Math.PI / 2;
									break;
							case 'backward':
									x = -1;
									theta = Math.PI;
									break;
							}
							;; console.log(value, x, y, theta);
							if (x != 0 || y != 0 || theta != 0) {
									var v = motion.moveTo(x, y, theta)
											.then(function() {
													;;; console.log('moveTo done', arguments);
											});
							}
					}, function (error) {
							console.log(error);
					})
			};

			[].slice.call(document.querySelectorAll('button.move')).forEach(function(button, index) {
					button.addEventListener('click', moveRobot);
			});

			document.getElementById('say-text').addEventListener('click', function() {
					var text = document.getElementById('text').value;
					if (text) {
							session.service('ALAnimatedSpeech').then(function (tts) {
									tts.say(text)
							}, function (error) {
									console.log(error);
							});
					}
			});
	});
} catch (err) {
  console.log("Error when initializing QiSession: " + err.message);
  console.log("Make sure you load this page from the robots server.")
}
}());