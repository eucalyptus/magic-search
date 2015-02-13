angular.module('MagicSearch', ['ui.bootstrap'])
    .directive('magicOverrides', function() {
        return {
            restrict: 'A',
            controller: function($scope) {
                // showMenu and hideMenu depend on foundation's dropdown. They need
                // to be modified to work with another dropdown implemenation.
                // For bootstrap, they are not needed at all.
                $scope.showMenu = function() {};
                $scope.hideMenu = function() {};
            }
        };
    });
