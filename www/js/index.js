;(function (window, angular) {
  angular.module("voiceRecognition", ["ionic"])
    .value("Setting", {
      lan: "zh"
    })
    .value("DeviceStatus", {
      offline: false,
      ready: false
    })
    .run(["DeviceStatus", "$document", "$rootScope", "$window", function (DeviceStatus, $document, $rootScope, $window) {
      $document[0].addEventListener("online", function () {
        $rootScope.$apply(function () {
          DeviceStatus.offline = false;
        });
      }, false);

      $document[0].addEventListener("offline", function () {
        $rootScope.$apply(function () {
          DeviceStatus.offline = true;
        });
      }, false);    

      $document[0].addEventListener("deviceready", function () {
        $rootScope.$apply(function () {
          DeviceStatus.offline = ($window.navigator.connection.type === $window.Connection.NONE);
          DeviceStatus.ready = true;
        });
      }, false);
    }]);
})(window, window.angular)