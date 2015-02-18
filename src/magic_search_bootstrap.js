angular.module('MagicSearch', ['ui.bootstrap'])
    .directive('magicOverrides', function() {
        return {
            restrict: 'A',
            controller: function($scope) {
                // showMenu and hideMenu depend on foundation's dropdown. They need
                // to be modified to work with another dropdown implemenation.
                // For bootstrap, they are not needed at all.
                $scope.showMenu = function() {
                    $scope.isMenuOpen = true;
                };
                $scope.hideMenu = function() {
                    $scope.isMenuOpen = false;
                };
                $scope.isMenuOpen = false;

                // remove the following when magic_search.js handles changing the facets/options
                $scope.$watch('facets_json', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    $scope.currentSearch = [];
                    $scope.initSearch();
                });

            }
        };
    });