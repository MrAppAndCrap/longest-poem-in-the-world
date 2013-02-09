$(function() {
	var start = 0;
	var verseTemplate = $("#verseTemplate").html();

	function initClouds(number) {
		var minTopPosition = 40;
		var maxTopPosition = 600;
		var lastTopPosition = 0;

		function createCloud() {
			var cloudContainer = $('<span class="cloud" />');
			var cloud = $('<img src="images/cloud.png" />');
			cloud.appendTo(cloudContainer);

			do {
				topPosition = minTopPosition + Math.round(Math.random() * (maxTopPosition - minTopPosition));
			} while (Math.abs(topPosition - lastTopPosition) < 200);
			lastTopPosition = topPosition;

			cloudContainer.css({
				top: topPosition
			});

			cloud.css({
				zoom: Math.random() / 2 + 0.5
			});

			cloudContainer.appendTo("body");

			cloud.animate({
				opacity: Math.random() / 2 + 0.5
			}, 1000);

			var transitionDuration = 20000 + Math.floor(Math.random() * 50000);
			cloudContainer.transition({
				x: $("body").width() - 200,
				duration: transitionDuration,
				easing: "linear"
			});

			setTimeout(function() {
				destroyCloud(cloud, cloudContainer);
			}, transitionDuration - 1000);
		}

		function destroyCloud(cloud, container) {
			cloud.animate({
				opacity: 0
			}, 1000);

			setTimeout(createCloud, 3000 + Math.floor(Math.random() * 3000));
		}

		var startTimeout = 0;
		for (var i = 0; i < number; i++) {
			setTimeout(createCloud, startTimeout);
			startTimeout += 4000 + Math.floor(Math.random() * 5000);
		}
	}

	function fetchVerses(start, callback) {
		$.get("http://api.longestpoemintheworld.com?start=" + start, function(data) {
			$("#total").html(data.total);

			var versesHtml = '';
			for (var i = 0; i < data.verses.length; i++) {
				versesHtml += verseTemplate.format(data.verses[i].user, data.verses[i].id, data.verses[i].name, data.verses[i].text);
			}
			$("#verses").html(versesHtml);
		});
	}

	fetchVerses(0); // starting id
	initClouds(5); // number of clouds

	$("#more > a").click(function(e) {
		e.preventDefault();
		start = start + 20;
		fetchVerses(start);
	});
});

// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return (typeof args[number] != 'undefined') ? args[number] : match;
		});
	};
}
