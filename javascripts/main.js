
angular.module('Demo', ['MagicSearch'])
    .controller('DemoCtrl', function($scope) {
        $scope.data_set = [
            {'name':'cookies', 'type':'baked'},
            {'name':'cake', 'type':'baked'},
            {'name':'pie', 'type':'baked'},
            {'name':'pudding', 'type':'cold'},
            {'name':'ice cream', 'type':'cold'}
        ];
        $scope.filtered_data = [];
        $scope.init = function() {
            $scope.filtered_data = $scope.data_set;
        };
        $scope.$on('searchUpdated', function($event, query) {
            // update url
            var url = window.location.href;
            if (url.indexOf("?") > -1) {
                url = url.split("?")[0];
            }
            if (query.length > 0) {
                url = url + "?" + query;
            }
            window.history.pushState(query, "", url);
            // normally, you would use an XHR call to get new "data_set", but we'll filter client-side for the demo
            var facets = query.split('&');
            $scope.filtered_data = $scope.data_set.filter(function(item) {
                for (var i=0; i<facets.length; i++) {
                    var facet = facets[i].split('=');
                    var val = item.hasOwnProperty(facet[0]) && item[facet[0]];
                    if (val.toLowerCase().indexOf(facet[1]) !== -1) {
                        return item;
                    }
                }
            });
            $scope.$apply();
        });
        $scope.$on('textSearch', function($event, text, filter_keys) {
            $scope.filtered_data = $scope.data_set.filter(function(item) {
                for (var i=0; i<filter_keys.length; i++) {
                    var prop = filter_keys[i];
                    var val = item.hasOwnProperty(prop) && item[prop];
                    if (val.toLowerCase().indexOf(text) !== -1) {
                        return item;
                    }
                }
            });
            $scope.$apply();
        });
    })
;
