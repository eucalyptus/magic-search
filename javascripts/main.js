
angular.module('Demo', ['MagicSearch'])
    .controller('DemoCtrl', function($scope, $timeout) {
        var vm = this;
        vm.facets = [
            {"name":"race", "label":"Race",
             "options":[
                 {"key":"nord", "label":"Nord"},
                 {"key":"orsimer", "label":"Orsimer"},
                 {"key":"breton", "label":"Breton"},
                 {"key":"imperial", "label":"Imperial"},
                 {"key":"dunmer", "label":"Dunmer"},
                 {"key":"argonian", "label":"Argonian"},
                 {"key":"khajiit", "label":"Khajiit"}
              ]
            },
            {"name":"location", "label":"Location",
             "options":[
                 {"key":"solitude", "label":"Solitude"},
                 {"key":"whiterun", "label":"Whiterun"},
                 {"key":"windhelm", "label":"Windhelm"},
                 {"key":"winterhold", "label":"Winterhold"},
                 {"key":"dawnstar", "label":"Dawnstar"},
                 {"key":"morthal", "label":"Morthal"},
                 {"key":"riften", "label":"Riften"},
                 {"key":"markarth", "label":"Markarth"}
              ]
            },
            {"name":"type", "label":"Profession",
             "options":[
                 {"key":"housecarl", "label":"Housecarl"},
                 {"key":"mage", "label":"Mage"},
                 {"key":"companion", "label":"Companion"},
                 {"key":"dark brotherhood", "label":"Dark Brotherhood"},
                 {"key":"dawnguard", "label":"Dawnguard"},
                 {"key":"mercenary", "label":"Mercenary"},
                 {"key":"miscellaneous", "label":"Miscellaneous"}
              ]
            },
            {"name":"marriage", "label":"Marriage",
             "options":[
                 {"key":"yes", "label":"Yes"},
                 {"key":"no", "label":"No"}
              ]
            },
            {"name":"blades", "label":"Blades",
             "options":[
                 {"key":"yes", "label":"Yes"},
                 {"key":"no", "label":"No"}
              ]
            },
            {"name":"steward", "label":"Steward",
             "options":[
                 {"key":"yes", "label":"Yes"},
                 {"key":"no", "label":"No"}
              ]
            }
        ];
        vm.skyrim_followers_data_set = [
            {'name':'Argis the Bulwark',
             'race':'Nord',
             'location':'Markarth',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Calder',
             'race':'Nord',
             'location':'Windhelm',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Gregor',
             'race':'Nord',
             'location':'Dawnstar',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Iona',
             'race':'Nord',
             'location':'Riften',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Jordis the Sword-Maiden',
             'race':'Nord',
             'location':'Solitude',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Lydia',
             'race':'Nord',
             'location':'Whiterun',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Rayya',
             'race':'Redguard',
             'location':'Falkreath',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Valdimar',
             'race':'Nord',
             'location':'Morthal',
             'type':'Housecarl',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Brelyna Maryon',
             'race':'Dunmer',
             'location':'Winterhold',
             'type':'Mage',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'J\'zargo',
             'race':'Khajiit',
             'location':'Winterhold',
             'type':'Mage',
             'marriage':'no',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Onmund',
             'race':'Nord',
             'location':'Winterhold',
             'type':'Mage',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Aela the Huntress',
             'race':'Nord',
             'location':'Whiterun',
             'type':'Companion',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Athis',
             'race':'Dunmer',
             'location':'Whiterun',
             'type':'Companion',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Farkas',
             'race':'Nord',
             'location':'Whiterun',
             'type':'Companion',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Njada Stonearm',
             'race':'Nord',
             'location':'Whiterun',
             'type':'Companion',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Ria',
             'race':'Imperial',
             'location':'Whiterun',
             'type':'Companion',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Torvar',
             'race':'Nord',
             'location':'Whiterun',
             'type':'Companion',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Vilkas',
             'race':'Nord',
             'location':'Whiterun',
             'type':'Companion',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Cicero',
             'race':'Imperial',
             'location':'Dawnstar',
             'type':'Assassin',
             'marriage':'no',
             'blades':'no',
             'steward':'no',
            },
            {'name':'Dark Brotherhood Initiate',
             'race':'Nord',
             'location':'Dawnstar',
             'type':'Assassin',
             'marriage':'no',
             'blades':'no',
             'steward':'no',
            },
            {'name':'Ingjard',
             'race':'Nord',
             'location':'Fort Dawnguard',
             'type':'Dawnguard',
             'marriage':'no',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Durak',
             'race':'Orsimer',
             'location':'Fort Dawnguard',
             'type':'Dawnguard',
             'marriage':'no',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Agmaer',
             'race':'Nord',
             'location':'Fort Dawnguard',
             'type':'Dawnguard',
             'marriage':'no',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Beleval',
             'race':'Bosmer',
             'location':'Fort Dawnguard',
             'type':'Dawnguard',
             'marriage':'no',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Celann',
             'race':'Breton',
             'location':'Fort Dawnguard',
             'type':'Dawnguard',
             'marriage':'no',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Belrand',
             'race':'Nord',
             'location':'Solitude',
             'type':'Mercenary',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Erik the Slayer',
             'race':'Nord',
             'location':'Rorikstead',
             'type':'Mercenary',
             'marriage':'no',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Jenassa',
             'race':'Dunmer',
             'location':'Whiterun',
             'type':'Mercenary',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Marcurio',
             'race':'Imperial',
             'location':'Riften',
             'type':'Mercenary',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Stenvar',
             'race':'Nord',
             'location':'Windhelm',
             'type':'Mercenary',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Teldryn Sero',
             'race':'Dunmer',
             'location':'Raven Rock',
             'type':'Mercenary',
             'marriage':'no',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Vorstag',
             'race':'Nord',
             'location':'Markarth',
             'type':'Mercenary',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Benor',
             'race':'Nord',
             'location':'Morthal',
             'type':'Miscellaneous',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Borgakh the Steel Heart',
             'race':'Orsimer',
             'location':'Mor Khazgur',
             'type':'Miscellaneous',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Cosnach',
             'race':'Breton',
             'location':'Markarth',
             'type':'Miscellaneous',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Derkeethus',
             'race':'Argonian',
             'location':'Darkwater Pass',
             'type':'Miscellaneous',
             'marriage':'yes',
             'blades':'yes',
             'steward':'no',
            },
            {'name':'Ghorbash the Iron Hand',
             'race':'Orsimer',
             'location':'Dushnikh Yal',
             'type':'Miscellaneous',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
            {'name':'Uthgerd the Unbroken',
             'race':'Nord',
             'location':'Whiterun',
             'type':'Miscellaneous',
             'marriage':'yes',
             'blades':'yes',
             'steward':'yes',
            },
        ];
        vm.data_set = vm.skyrim_followers_data_set;
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
            if (query !== undefined && query.length !== 0) {
                // prepare facets by grouping
                var tmp = query.split('&').sort();
                var facets = {};
                for (var i=0; i<tmp.length; i++) {
                    var facet = tmp[i].split('=');
                    if (facets[facet[0]] === undefined) {
                        facets[facet[0]] = [];
                    }
                    facets[facet[0]].push(facet[1]);
                }
                var results = vm.data_set;
                for (var key in facets) {
                    results = results.filter(function(item) {
                        var val = item.hasOwnProperty(key) && item[key];
                        if ($.inArray(val.toLowerCase(), facets[key]) > -1) {
                            return true;
                        }
                    });
                }
                vm.faceted_data = results;
            }
            else {
                vm.faceted_data = vm.data_set.slice();
            }
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
