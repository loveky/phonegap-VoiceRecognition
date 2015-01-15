;(function (window, angular) {
  angular.module("voiceRecognition")
    .service("Recognition", RecognitionService)
    .service("File", FileService)
    .service("VoiceRecorder", VoiceRecorderService);

  RecognitionService.$inject = ["$http", "$q", "Setting"];
  function RecognitionService ($http, $q, Setting) {
    this.recognise = function (data) {
      var defer = $q.defer();

      $http({
        method: "POST",
        url: "http://vop.baidu.com/server_api",
        data: data, 
        headers: {
          'Content-Type': 'audio/amr; rate=8000'
        },
        params: {
          cuid: "com.test.VoiceRecognition",
          lan: Setting.lan,
          token: "24.6b8927239667e392e8fd32980f6b2782.2592000.1422258131.282335-5047427"
        },
        transformRequest: []
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (data, status, headers, config) {
        defer.reject(data);
      });

      return defer.promise;
    };
  }

  FileService.$inject = ["$q", "$window"];
  function FileService ($q, $window) {
    this.readAsArrayBuffer = function (path) {
      var defer = $q.defer();

      $window.resolveLocalFileSystemURL(path, function(entry) {
        var reader = new $window.FileReader();

        reader.onload = function(evt) {
          defer.resolve(evt.target.result);
        }

        reader.onerror = function(evt) {
          defer.reject();
        };

        entry.file(function(s) {
          reader.readAsArrayBuffer(s);
        });
      });

      return defer.promise;
    }
  }

  VoiceRecorderService.$inject = ["$q", "$window", "$timeout", "$rootScope"];
  function VoiceRecorderService ($q, $window, $timeout, $rootScope) {
    var recording,
        record,
        recordCanceled,
        maxLengthCheckTimeout;

    this.startRecord = function (maxLength) {
      var defer = $q.defer();
      var file = $window.cordova.file.externalDataDirectory + "ha.3gp";

      resetState();

      record = new $window.Media(file, 
        function () {
          if (recordCanceled) {
            defer.reject({reason: "canceled"});
          }
          else {
            defer.resolve(file);
          }
        },
        function (error) {
          defer.reject({reason: "failed"});
        }
      );

      record.startRecord();

      if (angular.isDefined(maxLength)) {
        maxLengthCheckTimeout = $timeout(function exceedMaxLengthCallback () {
          record.stopRecord();
        }, maxLength * 1000);
      }

      return defer.promise;
    };

    this.stopRecord = function () {
      $timeout.cancel(maxLengthCheckTimeout);
      record.stopRecord();
    };

    this.cancelRecord = function () {
      $timeout.cancel(maxLengthCheckTimeout);
      recordCanceled = true;
      record.stopRecord();
      // TODO: 删除文件
    };

    function resetState () {
      recording = false;
      record = null;
      recordCanceled = false;
      maxLengthCheckTimeout = null;
    }
  }
})(window, window.angular)