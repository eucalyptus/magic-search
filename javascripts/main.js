
angular.module('Demo', ['MagicSearch'])
    .controller('DemoCtrl', function($scope, $timeout) {
        var vm = this;
        vm.data_set = [
            {'name':'cookies', 'type':'baked'},
            {'name':'cake', 'type':'baked'},
            {'name':'pie', 'type':'baked'},
            {'name':'pudding', 'type':'cold'},
            {'name':'ice cream', 'type':'cold'}
        ];
        vm.faceted_data = [];   // filterd by facets
        vm.filtered_data = [];  // filtered by facets and text
        vm.init = function() {
            vm.faceted_data = vm.data_set;
            vm.filtered_data = vm.data_set;
            // since we're not getting data from the server, do a client-filter based on URL
            var query = window.location.href;
            if (query.indexOf("?") > -1) {
                query = query.split("?")[1];
                $scope.$emit('searchUpdated', query);
            }
            $timeout(function() {
                $(document).foundation('dropdown', 'reflow');
            }, 500);
        };
        vm.filter_items = function() {
            if (vm.filter_text === undefined || vm.filter_text === '') {
                vm.filtered_data = vm.faceted_data.slice();
                return;
            }
            vm.filtered_data = vm.faceted_data.filter(function(item) {
                for (var i=0; i<vm.filter_keys.length; i++) {
                    var prop = vm.filter_keys[i];
                    var val = item.hasOwnProperty(prop) && item[prop];
                    if (val.toLowerCase().indexOf(vm.filter_text) !== -1) {
                        return true;
                    }
                }
            });
            $timeout(function () { $scope.$apply() });
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
            vm.faceted_data = vm.data_set.filter(function(item) {
                if (facets.length === 1 && facets[0].length === 0) return item;
                for (var i=0; i<facets.length; i++) {
                    var facet = facets[i].split('=');
                    var val = item.hasOwnProperty(facet[0]) && item[facet[0]];
                    if (val.toLowerCase().indexOf(facet[1]) !== -1) {
                        return true;
                    }
                }
            });
            vm.faceted_data.slice();
            vm.filter_items();
            $timeout(function () { $scope.$apply() });
        });
        $scope.$on('textSearch', function($event, text, filter_keys) {
            vm.filter_text = text;
            vm.filter_keys = filter_keys;
            vm.filter_items();
        });
    })
;
