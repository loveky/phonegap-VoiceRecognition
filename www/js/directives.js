;(function (window, angular) {
  angular.module("voiceRecognition")
    .directive("openInSystemBrowser", openInSystemBrowserDirective);

  openInSystemBrowserDirective.$inject = ["$window"];
  function openInSystemBrowserDirective ($window) {
    return {
      restric: "A",
      link: function (scope, iElement, iAttrs) {
        iElement.on("click", openInSystemBrowser);

        function openInSystemBrowser (event) {
          if (!angular.isUndefined(iAttrs.href)) {
            $window.open(iAttrs.href, '_system', 'location=yes');
            event.preventDefault();
          }
        }
      }
    };
  }
})(window, window.angular)