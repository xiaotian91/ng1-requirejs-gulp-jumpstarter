'use strict'
;(function() {
    angular.module('angularAudioPlayer', [])
        .service('audioPlayerService', AudioPlayerService)
        .directive('audioPlayerControl', ['$interval', '$document', 'audioPlayerService', AudioPlayerControl])
        .directive('audioVolumeControl', ['$interval', '$document', 'audioPlayerService', AudioVolumeControl]);

    function AudioPlayerControl($interval, $document, audioPlayerService) {

        function link(scope, element, attrs) {
            var self = this;
            self.updateTimer = undefined;
            self.lastMouseX = 0;

            self.progressBackgroundElement = angular.element(element[0].children[0].children[1].children[3]);
            self.progressBarElement = angular.element(element[0].children[0].children[1].children[3].children[0]);
            self.progressDraggableElement = angular.element(element[0].children[0].children[1].children[0]);
            self.progressDragged = false;
            self.progressDraggableElement.on('mousedown', function(event) {
                event.preventDefault();
                self.progressDragged = true;
                self.lastMouseX = event.pageX;

                $document.on('mousemove', self.onProgressMouseMove);
                $document.on('mouseup', self.onProgressMouseUp);
            });

            audioPlayerService.setOnTrackChanged(function() {

                self.refreshCurrentTime();
            });

            audioPlayerService.setOnPlaying(function() {
                self.onPlaying();
            });
            audioPlayerService.setOnPaused(function() {
                self.onPaused();
            });

            element.bind('mouseenter', function() {
                scope.hideCurrentTime = false;
                scope.hideDuration = false;
            });

            scope.isPlaying = false;
            scope.isMuted = false;

            scope.hideCurrentTime = true;
            scope.hideDuration = true;

            scope.hideCover = !(typeof attrs.hideCover === "undefined");
            scope.hideRewind = !(typeof attrs.hideRewind === "undefined");
            scope.hideFastForward = !(typeof attrs.hideFastForward === "undefined");
            scope.hideSkipPrevious = !(typeof attrs.hideSkipPrevious === "undefined");
            scope.hideStop = !(typeof attrs.hideStop === "undefined");
            scope.hideSkipNext = !(typeof attrs.hideSkipNext === "undefined");
            scope.hideVolume = !(typeof attrs.hideVolume === "undefined");
            scope.hideProgressBar = !(typeof attrs.hideProgressBar === "undefined");
            scope.hideDescription = !(typeof attrs.hideDescription === "undefined");

            scope.progressDraggablePercent = 0;
            scope.progressPercent = 0;
            scope.currentTime = 0;
            scope.duration = 0;

            scope.currentTimeFormatted = 0;
            scope.durationFormatted = 0;
            scope.description = null;

            scope.onStopClick = function() {
                self.stop();
            }

            scope.onPlayPauseClick = function() {
                if (scope.isPlaying) {
                    self.pause();

                } else {
                    self.play();
                    self.updateCurrentInfo();
                }
            }

            scope.onSkipPreviousClick = function() {
                audioPlayerService.skipPrevious();
                self.updateCurrentInfo();
            }

            scope.onSkipNextClick = function() {
                audioPlayerService.skipNext();
                self.updateCurrentInfo();
            }

            scope.onRewindClick = function(val) {
                audioPlayerService.rewind(val);
            }

            scope.onFastForwardClick = function(val) {
                audioPlayerService.fastForward(val);
            }

            scope.onProgressBarClick = function(event) {
                var seekPercentage = (event.offsetX / event.currentTarget.offsetWidth) * 100;
                if (seekPercentage > 100) {
                    seekPercentage = 100;
                }

                audioPlayerService.setProgressPercent(seekPercentage);

                self.play();
            }

            scope.$watch('src', function(newValue, oldValue) {
                if (newValue) {
                    audioPlayerService.setPlaylist([{
                        src: newValue,
                        type: scope.type
                    }]);
                }

                self.refreshCurrentTime();
            });

            scope.$watch('preload', function(newValue, oldValue) {
                if (newValue) {
                    audioPlayerService.setPreload(newValue);
                }
            });

            scope.$watch('type', function(newValue, oldValue) {
                if (newValue) {
                    audioPlayerService.setPlaylist([{
                        src: scope.src,
                        type: newValue
                    }]);
                }
            });

            scope.$on('$destroy', function() {
                //self.stop();
            });

            self.updateCurrentInfo = function() {
                scope.info = audioPlayerService.getCurrentPlaylistInfo();
            }

            self.onPlaying = function() {
                scope.isPlaying = true;
                self.startProgressTimer();
            }

            self.onPaused = function() {
                scope.isPlaying = false;
                self.stopProgressTimer();
                self.refreshCurrentTime();
            }

            self.play = function() {
                audioPlayerService.play();
            }

            self.pause = function() {
                audioPlayerService.pause();
            }

            self.stop = function() {
                audioPlayerService.stop();
            }

            self.refreshCurrentTime = function() {
                scope.duration = audioPlayerService.getDurationSeconds();
                scope.durationFormatted = self.formatTime(scope.duration);

                scope.currentTime = audioPlayerService.getProgressSeconds();
                scope.currentTimeFormatted = self.formatTime(scope.currentTime);

                scope.progressPercent = scope.currentTime * 100 / scope.duration;
                scope.progressDraggablePercent = scope.progressPercent < 1 ? 0 : scope.progressPercent - 1;

                self.progressBarElement.css({
                    width: scope.progressPercent + "%"
                });
                self.progressDraggableElement.css({
                    left: scope.progressDraggablePercent + "%"
                });
            }


            self.formatTime = function(value, format) {

                if (isNaN(value)) {
                    value = 0;
                }

                format = format || "h:m:s";

                var hr = Math.floor(value / 3600);
                var min = Math.floor((value % 3600) / 60);
                var sec = Math.floor(value % 60);

                if (hr != 0 && min < 10) {
                    min = "0" + min;
                }
                if (sec < 10) {
                    sec = "0" + sec;
                }

                if (hr == 0) {
                    format = "m:s";
                }

                var result = format.replace("h", "" + hr);
                result = result.replace("m", "" + min);
                result = result.replace("s", "" + sec);

                return result;
            }

            self.startProgressTimer = function() {
                if (angular.isDefined(self.updateTimer)) {
                    return;
                }

                self.updateTimer = $interval(self.refreshCurrentTime, 10);
            }

            self.stopProgressTimer = function() {
                if (angular.isDefined(self.updateTimer)) {
                    $interval.cancel(self.updateTimer);
                    self.updateTimer = undefined;
                }
            }

            self.onProgressMouseMove = function(event) {

                var offset = event.pageX - self.lastMouseX;
                self.lastMouseX = event.pageX;

                if (self.progressDragged) {
                    var progressPercent = audioPlayerService.getProgressPercent();
                    progressPercent += offset * 100 / self.progressBackgroundElement[0].offsetWidth;
                    audioPlayerService.setProgressPercent(progressPercent);
                    self.refreshCurrentTime();
                }
            }

            self.onProgressMouseUp = function(event) {
                self.progressDragged = false;

                $document.off('mousemove', self.onProgressMouseMove);
                $document.off('mouseup', self.onProgressMouseUp);
            }

            self.refreshCurrentTime();
        }

        return {
            restrict: 'E',
            scope: {
                src: '@',
                type: '@',
                preload: '@',
                info: '@'
            },
            templateUrl: '../../plugin/third-party/angular-h5audioplayer/angular-audioplayer-playercontrol.html',
            link: link
        }

    };

    function AudioPlayerService() {

        var self = this;

        self.shuffle = false;
        self.repeat = true;

        self.defaultStepSeconds = 10;
        self.isPlaying = false;
        self.player = new Audio();
        self.player.controls = false;
        setPreload("metadata");

        self.playlist = null;
        self.currentPlaylistIndex = 0;
        self.currentplaylistInfo = null;
        self.pendingSeekSeconds = -1;

        self.onReadyListeners = [];
        self.onTrackChangedListeners = [];
        self.onTrackEndedListeners = [];
        self.onVolumeChangedListeners = [];
        self.onPlayingListeners = [];
        self.onPausedListeners = [];
        self.onProgressChangedListeners = [];

        self.player.addEventListener('canplay', function() {
            onReady();
        });
        self.player.addEventListener('loadeddata', function() {
            onTrackChanged();
        });
        self.player.addEventListener('ended', function() {
            onTrackEnded();
        });
        self.player.addEventListener('volumechange', function() {
            onVolumeChanged();
        });
        self.player.addEventListener('play', function() {
            onPlaying();
        });
        self.player.addEventListener('pause', function() {
            onPaused();
        });
        self.player.addEventListener('timeupdate', function() {
            onProgress();
        });

        self.loadPlayerSource = function() {
            if (self.playlist && self.playlist[self.currentPlaylistIndex]) {
                self.loading = true;
                self.player.type = self.playlist[self.currentPlaylistIndex].type;
                self.player.src = self.playlist[self.currentPlaylistIndex].src;
            } else {
                self.loading = false;
                self.player.type = null;
                self.player.src = null;
            }
        }

        return ({
            setPlaylist: setPlaylist,
            getPlaylist: getPlaylist,
            play: play,
            pause: pause,
            stop: stop,
            skipNext: skipNext,
            skipPrevious: skipPrevious,
            setPlaylistIndex: setPlaylistIndex,
            getPlaylistIndex: getPlaylistIndex,
            setCurrentPlaylistInfo: setCurrentPlaylistInfo,
            getCurrentPlaylistInfo: getCurrentPlaylistInfo,

            setDefaultStepSeconds: setDefaultStepSeconds,
            fastForward: fastForward,
            rewind: rewind,

            mute: mute,
            setVolumePercent: setVolumePercent,
            getVolumePercent: getVolumePercent,

            setPreload: setPreload,
            setProgressSeconds: setProgressSeconds,
            getProgressSeconds: getProgressSeconds,
            setProgressPercent: setProgressPercent,
            getProgressPercent: getProgressPercent,
            getDurationSeconds: getDurationSeconds,
            getIsPlaying: getIsPlaying,
            getIsMuted: getIsMuted,

            //EVENT LISTENER SETTERS
            setOnReady: setOnReady,
            setOnTrackChanged: setOnTrackChanged,
            setOnTrackEnded: setOnTrackEnded,
            setOnVolumeChanged: setOnVolumeChanged,
            setOnPlaying: setOnPlaying,
            setOnPaused: setOnPaused,
            setOnProgressChanged: setOnProgressChanged
        });

        function setPreload(preload) {
            self.player.preload = preload;
        }

        function setDefaultStepSeconds(defaultStepSeconds) {
            self.defaultStepSeconds = defaultStepSeconds;
        }

        function setPlaylist(playlist) {
            self.playlist = playlist;
            self.currentPlaylistIndex = 0;

            self.loadPlayerSource();
        }

        function getPlaylist() {
            return self.playlist;
        }

        function setPlaylistIndex(idx) {
            self.currentPlaylistIndex = idx;
            setCurrentPlaylistInfo();
            self.loadPlayerSource();
        }

        function getPlaylistIndex() {
            return self.currentPlaylistIndex;
        }

        function setCurrentPlaylistInfo() {
            self.currentplaylistInfo = self.playlist[self.currentPlaylistIndex].info;
        }

        function getCurrentPlaylistInfo() {
            return self.currentplaylistInfo || self.playlist[self.currentPlaylistIndex].info;
        }

        function play() {
            self.player.play();
        }

        function pause() {
            self.player.pause();
        }

        function stop() {
            pause();
            setProgressPercent(0);
            onPaused();
        }

        function skipNext() {

            if (!self.playlist) {
                return;
            }

            pause();

            var idx = self.currentPlaylistIndex + 1;

            if (idx >= self.playlist.length) {

                if (self.repeat) {
                    idx = 0;
                } else {
                    return;
                }
            }

            setPlaylistIndex(idx);
            play();
        }

        function skipPrevious() {
            if (!self.playlist) {
                return;
            }

            pause();

            var idx = self.currentPlaylistIndex - 1;

            if (idx < 0) {
                if (self.repeat) {
                    idx = self.playlist.length - 1;
                } else {
                    return;
                }
            }

            setPlaylistIndex(idx);
            play();
        }

        function fastForward(stepSeconds) {
            var step = stepSeconds || self.defaultStepSeconds;

            if (self.player.readyState == 0) {
                return;
            }

            self.player.currentTime += step;
        }

        function rewind(stepSeconds) {
            var step = stepSeconds || self.defaultStepSeconds;

            if (self.player.readyState == 0) {
                return;
            }

            self.player.currentTime -= step;
        }

        function mute() {
            self.player.muted = !self.player.muted;
        }

        function setVolumePercent(volumePercent) {
            var vol = volumePercent / 100;

            if (vol > 1) {
                vol = 1;
            }

            if (vol < 0) {
                vol = 0;
            }

            self.player.volume = vol;
        }

        function getVolumePercent() {
            return self.player.volume * 100;
        }

        function setProgressSeconds(progressSeconds) {

            if (self.player.readyState == 0) {
                return;
            }

            if (self.loading) {
                self.pendingSeekSeconds = progressSeconds;
            } else {
                self.player.currentTime = progressSeconds;
            }
        }

        function getProgressSeconds() {
            return self.player.currentTime;
        }

        function setProgressPercent(progressPercent) {

            if (isNaN(self.player.duration)) {
                setProgressSeconds(0);
                return;
            }

            var progressSeconds = self.player.duration * progressPercent / 100;
            setProgressSeconds(progressSeconds);
        }

        function getProgressPercent() {
            return self.player.currentTime * 100 / self.player.duration;
        }

        function getDurationSeconds() {
            return self.player.duration;
        }

        function getIsPlaying() {
            return self.isPlaying;
        }

        function getIsMuted() {
            return player.muted;
        }

        function onReady() {
            for (var i = 0; i < self.onReadyListeners.length; i++) {
                self.onReadyListeners[i]();
            }

            self.loading = false;

            if (self.pendingSeekSeconds >= 0) {
                setProgressSeconds(pendingSeekSeconds);
            }
        }

        function onTrackChanged() {
            for (var i = 0; i < self.onTrackChangedListeners.length; i++) {
                self.onTrackChangedListeners[i]();
            }
        }


        function onTrackEnded() {
            for (var i = 0; i < self.onTrackEndedListeners.length; i++) {
                self.onTrackEndedListeners[i]();
            }

            skipNext();
        }


        function onVolumeChanged() {
            for (var i = 0; i < self.onVolumeChangedListeners.length; i++) {
                self.onVolumeChangedListeners[i]();
            }
        }


        function onPlaying() {
            for (var i = 0; i < self.onPlayingListeners.length; i++) {
                self.onPlayingListeners[i]();
            }

            self.isPlaying = true;
        }


        function onPaused() {
            for (var i = 0; i < self.onPausedListeners.length; i++) {
                self.onPausedListeners[i]();
            }

            self.isPlaying = false;
        }

        function onProgress() {
            for (var i = 0; i < self.onProgressChangedListeners.length; i++) {
                self.onProgressChangedListeners[i]();
            }
        }

        function setOnReady(onReadyListener) {
            if (onReadyListener) {
                self.onReadyListeners.push(onReadyListener);
            }
        }

        function setOnTrackChanged(onTrackChangedListener) {
            if (onTrackChangedListener) {
                self.onTrackChangedListeners.push(onTrackChangedListener);
            }
        }

        function setOnTrackEnded(onTrackEndedListener) {
            if (onTrackEndedListener) {
                self.onTrackEndedListeners.push(onTrackEndedListener);
            }
        }

        function setOnVolumeChanged(onVolumeChangedListener) {
            if (onVolumeChangedListener) {
                self.onVolumeChangedListeners.push(onVolumeChangedListener);
            }
        }

        function setOnPlaying(onPlayingChangedListener) {
            if (onPlayingChangedListener) {
                self.onPlayingListeners.push(onPlayingChangedListener);
            }
        }

        function setOnPaused(onPausedChangedListener) {
            if (onPausedChangedListener) {
                self.onPausedListeners.push(onPausedChangedListener);
            }
        }

        function setOnProgressChanged(onProgressChangedListener) {
            if (onProgressChangedListener) {
                self.onProgressChangedListeners.push(onProgressChangedListener);
            }
        }
    };

    function AudioVolumeControl($interval, $document, audioPlayerService) {

        function link(scope, element, attrs) {

            var self = this;
            self.lastMouseX = 0;

            self.volumeDraggableElement = angular.element(element[0].children[0].children[1].children[0]);
            self.volumeBackgroundElement = angular.element(element[0].children[0].children[1].children[1]);
            self.volumeBarElement = angular.element(element[0].children[0].children[1].children[1].children[0]);
            self.volumeDragged = false;

            self.volumeDraggableElement.on('mousedown', function(event) {
                event.preventDefault();
                self.volumeDragged = true;
                self.lastMouseX = event.pageX;

                $document.on('mousemove', self.onVolumeMouseMove);
                $document.on('mouseup', self.onVolumeMouseUp);
            });

            audioPlayerService.setOnVolumeChanged(function() {
                self.refreshVolume();
            });

            scope.isMuted = false;

            scope.volumeDraggablePercent = 0;
            scope.volumePercent = 0;

            scope.onMuteClick = function() {
                scope.isMuted = !scope.isMuted;
                audioPlayerService.mute();
            }

            scope.onVolumeBarClick = function(event) {
                var volumePercentage = (event.offsetX / event.currentTarget.offsetWidth) * 100;
                if (volumePercentage > 100) {
                    volumePercentage = 100;
                }

                audioPlayerService.setVolumePercent(volumePercentage);

                self.refreshVolume();
            }

            self.refreshVolume = function() {
                scope.volumePercent = audioPlayerService.getVolumePercent();
                scope.volumeDraggablePercent = scope.volumePercent < 1 ? 0 : scope.volumePercent - 1;
                self.volumeBarElement.css({
                    width: scope.volumePercent + "%"
                });

                var range = self.volumeBackgroundElement[0].offsetWidth;
                var cssPositionPercent = scope.volumeDraggablePercent - (self.volumeDraggableElement[0].offsetWidth / 2 / range) * 100;

                self.volumeDraggableElement.css({
                    left: cssPositionPercent + "%"
                });
            }

            self.onVolumeMouseMove = function(event) {

                var offset = event.pageX - self.lastMouseX;
                self.lastMouseX = event.pageX;

                if (self.volumeDragged) {
                    var volumePercent = audioPlayerService.getVolumePercent();
                    var range = self.volumeBackgroundElement[0].offsetWidth;
                    volumePercent += offset * 100 / range;
                    audioPlayerService.setVolumePercent(volumePercent);
                    self.refreshVolume();
                }
            }

            self.onVolumeMouseUp = function(event) {
                self.volumeDragged = false;

                $document.off('mousemove', self.onVolumeMouseMove);
                $document.off('mouseup', self.onVolumeMouseUp);
            }

            self.refreshVolume();
        }

        return {
            restrict: 'E',
            scope: {
                volume: '@'
            },
            templateUrl: '../../plugin/third-party/angular-h5audioplayer/angular-audioplayer-volumecontrol.html',
            link: link
        }
    };



})();