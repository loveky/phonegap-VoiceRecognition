;(function (window, angular) {
  angular.module("voiceRecognition", ["ionic"]);

  angular.module("voiceRecognition")
    .controller("homeController", homeController)
    .controller("languageSelectController", languageSelectController)
    .value("Setting", {
      lan: "zh"
    })
    .directive("openInAppBrowser", openInAppBrowserDirective);

  homeController.$inject = ["$scope", "$window", "$document", "$http", "$ionicPopover", "$ionicLoading", "Setting", "$timeout"];
  function homeController ($scope, $window, $document, $http, $ionicPopover, $ionicLoading, Setting, $timeout) {
    var vm = this;
    var file;
    var record;
    var maxVoiceLengthInSeconds = 55;
    var exceedMaxVoiceLength = false;
    var voiceLengthTimeout = null;
    vm.ready = false;

    vm.history = [];
    vm.showHint = false;
    vm.buttonText = "按下 说话";

    $document[0].addEventListener("online", function () {
      $scope.$apply(function () {
        vm.offline = false;
      });
    }, false);

    $document[0].addEventListener("offline", function () {
      $scope.$apply(function () {
        vm.offline = true;
      });
    }, false);    

    $document[0].addEventListener("deviceready", function () {
      $scope.$apply(function () {
        vm.offline = ($window.navigator.connection.type === $window.Connection.NONE);
        vm.ready = true;
      });
    }, false);

    vm.startRecord = function () {
      file = "hahaha.3gp";
      record = new Media($window.cordova.file.externalRootDirectory + file, function () {
        $window.resolveLocalFileSystemURL($window.cordova.file.externalRootDirectory + file, function(entry) {
          var reader = new FileReader();

          if (vm.recordCanceled) {
            return;
          }

          reader.onload = function(evt) {
            $ionicLoading.show({
              template: '识别中...'
            });
            $http({
              method: "POST",
              url: "http://vop.baidu.com/server_api",
              data: evt.target.result, 
              headers: {
                'Content-Type': 'audio/amr; rate=8000'
              },
              params: {
                cuid: "test",
                lan: Setting.lan,
                token: "24.6b8927239667e392e8fd32980f6b2782.2592000.1422258131.282335-5047427"
              },
              transformRequest: []
            }).success(function (data) {
              $ionicLoading.hide();
              vm.history.push(data);
            }).error(function (data, status, headers, config) {
              $ionicLoading.hide();
              // 请求失败
            });
          }
          reader.onerror = function(evt) {
            // 读取失败
          };
          entry.file(function(s) {
              reader.readAsArrayBuffer(s);
          });
        });
      }, function (error) {
        $scope.$apply(function () {
          vm.status = error;
        });
      });

      record.startRecord();
      vm.recordCanceled = false;
      vm.buttonText = "松开 结束";
      vm.hintText = "向上滑动 取消识别";
      vm.showHint = true;
      voiceLengthTimeout = $timeout(function () {
        vm.stopRecord();
        exceedMaxVoiceLength = true;
      }, maxVoiceLengthInSeconds * 1000);
    };

    vm.stopRecord = function () {
      if (exceedMaxVoiceLength) {
        return;
      }
      else {
        $timeout.cancel(voiceLengthTimeout);
      }
      vm.buttonText = "按下 说话";
      vm.showHint = false;
      record.stopRecord();
    };

    vm.cancelRecord = function () {
      vm.recordCanceled = true;
      vm.hintText = vm.buttonText = "松开手指 取消识别";
    };

    vm.selectLanguage = function ($event) {
      vm.selectLanguagePopover.show($event);
    };

    $ionicPopover.fromTemplateUrl('templates/select_language_popover.html', {
      scope: $scope,
    }).then(function(popover) {
      vm.selectLanguagePopover = popover;
    });
  }

  languageSelectController.$inject = ["$scope", "Setting"];
  function languageSelectController ($scope, Setting) {
    var vm = this;
    vm.setting = Setting;
  }

  openInAppBrowserDirective.$inject = ["$window"];
  function openInAppBrowserDirective ($window) {
    return {
      restric: "A",
      link: function (scope, iElement, iAttrs) {
        iElement.on("click", openInAppBrowser);

        function openInAppBrowser (event) {
          if (angular.isUndefined(iAttrs.href)) {
            $window.open(iAttrs.href, '_system', 'location=yes');
            event.preventDefault();
          }
        }
      }
    };
  }
})(window, window.angular)