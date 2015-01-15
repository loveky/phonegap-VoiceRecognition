;(function (window, angular) {
  angular.module("voiceRecognition")
    .controller("homeController", homeController)
    .controller("languageSelectController", languageSelectController);

  homeController.$inject = ["$scope", "$window", "$document", "$http", "$ionicPopover", "$ionicLoading", "Recognition", "$timeout", "File", "VoiceRecorder", "DeviceStatus"];
  function homeController ($scope, $window, $document, $http, $ionicPopover, $ionicLoading, Recognition, $timeout, File, VoiceRecorder, DeviceStatus) {
    var vm = this;
    vm.history = [];
    vm.showHint = false;
    vm.buttonText = "按下 说话";

    vm.canRecord = function () {
      return DeviceStatus.ready && !DeviceStatus.offline;
    };

    vm.startRecord = function () {
      vm.showHint = true;
      vm.buttonText = "松开 结束";
      vm.hintText = "向上滑动 取消识别";

      VoiceRecorder.startRecord(55)
        .then(File.readAsArrayBuffer)
        .then(Recognition.recognise)
        .then(RecogniseSuccessCallback);
    };

    vm.stopRecord = function () {
      vm.showHint = false;
      vm.buttonText = "按下 说话";

      VoiceRecorder.stopRecord();
    };

    vm.cancelRecord = function () {
      vm.hintText = vm.buttonText = "松开手指 取消识别";
      VoiceRecorder.cancelRecord();
    };

    function RecogniseSuccessCallback (result) {
      vm.history.push(result);
    }
  }

  languageSelectController.$inject = ["Setting"];
  function languageSelectController (Setting) {
    var vm = this;
    vm.setting = Setting;
  }
})(window, window.angular)