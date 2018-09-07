let searchParams = new URLSearchParams(window.location.search);
if (searchParams.has("v") && searchParams.get("v")) {
	let urlVideo = searchParams.get("v");
	let request = new XMLHttpRequest();
	request.open("GET", urlVideo + "/.json", true);
	request.onload = function() {
		let data = JSON.parse(request.responseText);
		if (request.status >= 200 && request.status < 400) {
			try {
				document.title = data[0].data.children[0].data.title;
				let redditVideoData = data[0].data.children[0].data.media.reddit_video;
				if (redditVideoData) {
					loadVideoUrls(redditVideoData);
				}
			} catch (error) {
				document.getElementsByClassName("video-container")[0].innerHTML = "<h1>Error</h1><h2>URL doesn\'t have a v.redd.it video</h2>";
			}
		} else {
			document.getElementsByClassName("video-container")[0].innerHTML = "<h1>" + data.error + "</h1><h2>" + data.message + "</h2>";
		}
	};
	request.onerror = function() {
		document.getElementsByClassName("video-container")[0].innerHTML = "<h1>Error</h1><h2>Network request failed</h2>";
	};
	request.send();
} else {
	document.getElementsByClassName("video-container")[0].innerHTML = "<form><label for='v'>URL to Reddit Post</label><input name='v'><button type='submit'>Send</button></form>";
}
let loadVideoUrls = function(redditVideoData) {
	videoUrl = redditVideoData.fallback_url;
	audioUrl = videoUrl.substring(0, videoUrl.lastIndexOf('/') + 1) + "audio";
	videojs('video-player').src({
		type : 'video/mp4',
		src : videoUrl
	});
	document.getElementById("audio-source").setAttribute("src", audioUrl);
	let audioPlayer = document.getElementById("audio-player");
	audioPlayer.load();
};

let videoPlayer = document.getElementById("video-player");
let audioPlayer = document.getElementById("audio-player");

videojs('video-player', {}, function() {
	this.volume(0.5);
	audioPlayer.volume = 0.5;
});

let changeAudioTime = true;

let pauseAudio = function() {
	audioPlayer.pause();
	changeAudioTime = true;
};

let resumeAudio = function() {
	audioPlayer.play();
	if (changeAudioTime) {
		audioPlayer.currentTime = videoPlayer.currentTime;
		changeAudioTime = false;
	}
};

videoPlayer.onpause = function() {
	pauseAudio();
};

videoPlayer.onplay = function() {
	resumeAudio();
};

videoPlayer.onwaiting = function() {
	pauseAudio();
};

videoPlayer.onplaying = function() {
	resumeAudio();
};

videoPlayer.onvolumechange = function() {
	audioPlayer.volume = videoPlayer.volume;
};