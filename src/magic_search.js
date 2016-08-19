/**
 * @fileOverview Magic Search JS
 * @requires AngularJS
 *
 */

// Allow the module to be pre-defined with additional dependencies
try{
    angular.module('MagicSearch');
} catch (exception) {
    angular.module('MagicSearch', []);
}

angular.module('MagicSearch')
    .directive('magicSearch', function($compile) {
        return {
            restrict: 'E',
            scope: {
                facets_param: '@facets',
                filter_keys: '=filterKeys',
                strings: '=strings'
            },
            templateUrl: function (scope, elem) {
                return elem.template;
            },
            controller: function ($scope, $element, $timeout, $location) {

                var KEY_CODE_ENTER = 13,
                    KEY_CODE_TAB = 9,
                    KEY_CODE_ESC = 27,
                    KEY_CODE_BACKSPACE = 8,
                    KEY_CODE_DELETE = 46;

                var searchInput = $element.find('.search-input');
                $scope.promptString = $scope.strings.prompt;
                $scope.currentSearch = [];
                $scope.initSearch = function() {
                    if (typeof $scope.facets_param === 'string') {
                        // Parse facets JSON and convert to a list of facets.
                        var tmp = $scope.facets_param.replace(/__apos__/g, "\'").replace(/__dquote__/g, '\\"').replace(/__bslash__/g, "\\");
                        $scope.facetsObj = JSON.parse(tmp);
                    }
                    else {
                        // Assume this is a usable javascript object
                        $scope.facetsObj = $scope.facets_param;
                    }
                    $scope.facetsSave = $scope.copyFacets($scope.facetsObj);
                    $scope.initFacets();
                };
                $scope.syncCurrentSearchToUrl = function() {
                    var facetsInUrl = angular.copy($location.search());
                    $scope.currentSearch.forEach(facet => {
                        if (!facetsInUrl[facet.name]) {
                            facetsInUrl[facet.name] = facet.value;
                        }
                    });

                    if ($scope.textSearch !== undefined) {
                        facetsInUrl.text = $scope.textSearch;
                    }

                    $location.search(facetsInUrl).replace();
                };
                $scope.initFacets = function() {
                    // set facets selected and remove them from facetsObj
                    var urlParams = $location.search();
                    if (Object.keys(urlParams).length > 0) {
                        $timeout(function() {
                            $scope.strings.prompt = '';
                        });
                    }
                    angular.forEach(Object.keys(urlParams), function(urlParam, idx) {
                        var urlValue = urlParams[urlParam];
                        angular.forEach($scope.facetsObj, function(facet, idx) {
                            if (facet.name == urlParam) {
                                if (facet.options === undefined) {

                                    $scope.currentSearch.push({
                                        name: facet.name,
                                        nameLabel: facet.label,
                                        value: urlValue
                                    });

                                    // allow free-form facets to remain
                                }
                                else {
                                    angular.forEach(facet.options, function(option, idx) {
                                        if (option.key == urlValue) {

                                            $scope.currentSearch.push({
                                                name: facet.name,
                                                nameLabel: facet.label,
                                                value: urlValue,
                                                valueLabel: option.label
                                            });

                                            if (facet.singleton === true) {
                                                $scope.deleteFacetEntirely(facet.name);
                                            }
                                            else {
                                                $scope.deleteFacetSelection(facet.name, urlValue);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    });

                    if ($scope.textSearch !== undefined || urlParams.text) {

                        $scope.currentSearch.push({
                            name: 'text',
                            nameLabel: $scope.strings.text,
                            value: $scope.textSearch || urlParams.text
                        });
                    }
                    $scope.filteredObj = $scope.facetsObj;
                };
                $scope.addFacets = function(facets) {
                    // add a facets javascript object to the existing list
                    for (var facet in facets) {
                        $scope.facetsObj.append(facet);
                    }
                };
                $scope.copyFacets = function(facets) {
                    var ret = [];
                    for (var i=0; i<facets.length; i++) {
                        var facet = Object.create(facets[i]);
                        if (facets[i].options !== undefined) {
                            facet.options = [];
                            for (var j=0; j<facets[i].options.length; j++) {
                                facet.options.push(Object.create(facets[i].options[j]));
                            }
                        }
                        ret.push(facet);
                    }
                    return ret;
                };
                // removes a facet from the menu
                $scope.deleteFacetSelection = function(facetName, facetValue) {
                    angular.forEach($scope.facetsObj.slice(), function(facet, idx) {
                        if (facet.name == facetName) {
                            if (facet.options === undefined) {
                                return;  // allow free-form facets to remain
                            }
                            for (var i=0; i<facet.options.length; i++) {
                                var option = facet.options[i];
                                if (option.key == facetValue) {
                                    $scope.facetsObj[idx].options.splice($scope.facetsObj[idx].options.indexOf(option), 1);
                                }
                            }
                            if (facet.options.length === 0) {
                                $scope.deleteFacetEntirely(facetName);
                            }
                        }
                    });
                };
                $scope.deleteFacetEntirely = function(facetName) {
                    // remove entire facet
                    angular.forEach($scope.facetsObj.slice(), function(facet, idx) {
                        if (facet.name == facetName) {
                            $scope.facetsObj.splice($scope.facetsObj.indexOf(facet), 1);
                        }
                    });
                };
                searchInput.on('keydown', function($event) {
                    var key = $event.keyCode || $event.charCode;
                    if (key == KEY_CODE_TAB) {  // prevent default when we can.
                        $event.preventDefault();
                    }
                });
                searchInput.on('keyup', function($event) {  // handle ctrl-char input
                    if ($event.metaKey === true) {
                        return;
                    }
                    var searchVal = searchInput.val();
                    var key = $event.keyCode || $event.charCode;
                    if (key == KEY_CODE_TAB) {  // tab, so select facet if narrowed down to 1
                        if ($scope.facetSelected === undefined) {
                            if ($scope.filteredObj.length != 1) return;
                            $scope.facetClicked(0, '', $scope.filteredObj[0].name);
                        }
                        else {
                            if ($scope.filteredOptions === undefined || $scope.filteredOptions.length != 1) return;
                            $scope.optionClicked(0, '', $scope.filteredOptions[0].key);
                            $scope.resetState();
                        }
                        $timeout(function() {
                            searchInput.val('');
                        });
                        return;
                    }
                    if (key == KEY_CODE_ESC) {  // esc, so cancel and reset everthing
                        $timeout(function() {
                            $scope.hideMenu();
                            searchInput.val('');
                        });
                        $scope.resetState();
                        var textFilter = $scope.textSearch;
                        if (textFilter === undefined) {
                            textFilter = '';
                        }
                        $scope.$emit('textSearch', textFilter, $scope.filter_keys);
                        return;
                    }
                    if (key == KEY_CODE_ENTER) {  // enter, so accept value
                        // if tag search, treat as regular facet
                        if ($scope.facetSelected && $scope.facetSelected.options === undefined) {

                            $scope.currentSearch.push({
                                name: $scope.facetSelected.name,
                                nameLabel: $scope.facetSelected.label[0],
                                value: searchVal
                            });

                            $scope.resetState();
                            $scope.emitQuery();
                            $scope.showMenu($event);
                            $scope.$apply();
                        }
                        // if text search treat as search
                        else {
                            for (i=0; i<$scope.currentSearch.length; i++) {
                                if ($scope.currentSearch[i].name === 'text') {
                                    $scope.currentSearch.splice(i, 1);
                                }
                            }

                            $scope.currentSearch.push({
                                name: 'text',
                                nameLabel: $scope.strings.text,
                                value: searchVal
                            });

                            $scope.$apply();
                            $scope.hideMenu($event);
                            searchInput.val('');
                            $scope.$emit('textSearch', searchVal, $scope.filter_keys);
                            $scope.textSearch = searchVal;
                            $scope.emitQuery();
                        }
                        $scope.filteredObj = $scope.facetsObj;
                        $scope.syncCurrentSearchToUrl();
                    }
                    else {
                        if (searchVal === '') {
                            $scope.filteredObj = $scope.facetsObj;
                            $scope.$apply();
                            $scope.$emit('textSearch', '', $scope.filter_keys);
                            if ($scope.facetSelected && $scope.facetSelected.options === undefined) {
                                $scope.resetState();
                            }
                        }
                        else {
                            $scope.filterFacets($event, searchVal);
                        }
                    }
                });
                searchInput.on('keypress', function($event) {  // handle character input
                    var searchVal = searchInput.val();
                    var key = $event.which || $event.keyCode || $event.charCode;

                    if (key != KEY_CODE_BACKSPACE &&
                        key != KEY_CODE_DELETE &&
                        key != KEY_CODE_ENTER &&
                        key != KEY_CODE_TAB &&
                        key != KEY_CODE_ESC)
                    {
                        searchVal = searchVal + String.fromCharCode(key).toLowerCase();
                    }
                    if (searchVal == ' ') {  // space and field is empty, show menu
                        $scope.showMenu($event);
                        $timeout(function() {
                            searchInput.val('');
                        });
                        return;
                    }
                    if (searchVal === '') {
                        $scope.filteredObj = $scope.facetsObj;
                        $scope.$apply();
                        $scope.$emit('textSearch', '', $scope.filter_keys);
                        if ($scope.facetSelected && $scope.facetSelected.options === undefined) {
                            $scope.resetState();
                        }
                        return;
                    }
                    if (key != KEY_CODE_BACKSPACE && key != KEY_CODE_DELETE) {
                        $scope.filterFacets($event, searchVal);
                    }
                });
                $scope.filterFacets = function($event, searchVal) {
                    // try filtering facets/options.. if no facets match, do text search
                    var i, idx, label;
                    var filtered = [];
                    if ($scope.facetSelected === undefined) {
                        $scope.filteredObj = $scope.facetsObj;
                        for (i=0; i<$scope.filteredObj.length; i++) {
                            var facet = $scope.filteredObj[i];
                            idx = facet.label.toLowerCase().indexOf(searchVal);
                            if (idx > -1) {
                                label = [facet.label.substring(0, idx), facet.label.substring(idx, idx + searchVal.length), facet.label.substring(idx + searchVal.length)];
                                filtered.push({'name':facet.name, 'label':label, 'options':facet.options});
                            }
                        }
                        if (filtered.length > 0) {
                            $scope.showMenu($event);
                            $timeout(function() {
                                $scope.filteredObj = filtered;
                            }, 0.1);
                        }
                        else {
                            $scope.$emit('textSearch', searchVal, $scope.filter_keys);
                            $scope.hideMenu($event);
                        }
                    }
                    else {  // assume option search
                        $scope.filteredOptions = $scope.facetOptions;
                        if ($scope.facetOptions === undefined) { // no options, assume free form text facet
                            return;
                        }
                        for (i=0; i<$scope.filteredOptions.length; i++) {
                            var option = $scope.filteredOptions[i];
                            idx = option.label.toLowerCase().indexOf(searchVal);
                            if (idx > -1) {
                                label = [option.label.substring(0, idx), option.label.substring(idx, idx + searchVal.length), option.label.substring(idx + searchVal.length)];
                                filtered.push({'key':option.key, 'label':label});
                            }
                        }
                        if (filtered.length > 0) {
                            $scope.showMenu($event);
                            $timeout(function() {
                                $scope.filteredOptions = filtered;
                            }, 0.1);
                        }
                    }
                };
                // enable text entry when mouse clicked anywhere in search box
                $element.find('.search-main-area').on('click', function($event) {
                    var target = $($event.target);
                    if (target.is('.search-main-area')) {
                        searchInput.trigger('focus');
                        $scope.showMenu($event);
                    }
                });

                // when facet clicked, add 1st part of facet and set up options
                $scope.facetClicked = function($index, $event, name) {
                    $scope.hideMenu();
                    var facet = $scope.filteredObj[$index];
                    var label = facet.label;
                    if (Array.isArray(label)) {
                        label = label.join('');
                    }
                    $scope.facetSelected = {'name':facet.name, 'label':[label, '']};
                    if (facet.options !== undefined) {
                        $scope.filteredOptions = $scope.facetOptions = facet.options;
                        $scope.showMenu($event);
                    }
                    $timeout(function() {
                        searchInput.val('');
                    });
                    $scope.strings.prompt = '';
                    $timeout(function() {
                        searchInput.focus();
                    });
                };
                // when option clicked, complete facet and send event
                $scope.optionClicked = function($index, $event, option) {
                    $scope.hideMenu($event);

                    var labels = $scope.filteredOptions[$index].label;
                    var optionLabel = Array.isArray(labels) ? labels.join('') : labels;

                    $scope.currentSearch.push({
                        name: $scope.facetSelected.name,
                        nameLabel: $scope.facetSelected.label[0],
                        value: option,
                        valueLabel: optionLabel
                    });

                    $scope.syncCurrentSearchToUrl();
                    $scope.resetState();
                    $scope.emitQuery();
                    $scope.showMenu($event);
                };

                // send event with new query string
                $scope.emitQuery = function(removed) {
                    if (removed !== undefined && removed === 'text') {
                        $scope.$emit('textSearch', '', $scope.filter_keys);
                        $scope.textSearch = undefined;
                    }
                    else {
                        $scope.$emit('searchUpdated', $scope.currentSearch);
                        if ($scope.currentSearch.length > 0) {
                            // prune facets as needed from menus
                            var newFacet = $scope.currentSearch[$scope.currentSearch.length-1];
                            angular.forEach($scope.facetsSave, function(facet, idx) {
                                if (facet.name == newFacet.name) {
                                    if (facet.singleton === true) {
                                        $scope.deleteFacetEntirely(facet.name);
                                    }
                                    else {
                                        $scope.deleteFacetSelection(facet.name, newFacet.value);
                                    }
                                }
                            });
                        }
                    }
                };

                // remove facet and either update filter or search
                $scope.removeFacet = function($index, $event) {
                    var removed = $scope.currentSearch[$index].name;
                    $scope.currentSearch.splice($index, 1);
                    if ($scope.facetSelected === undefined) {
                        $scope.emitQuery(removed);
                    }
                    else {
                        $scope.resetState();
                        searchInput.val('');
                    }
                    if ($scope.currentSearch.length === 0) {
                        $scope.strings.prompt = $scope.promptString;
                    }

                    // remove facet from url before refreshing facets
                    $location.search(removed, undefined).replace();

                    // re-init to restore facets cleanly
                    $scope.facetsObj = $scope.copyFacets($scope.facetsSave);
                    $scope.currentSearch = [];
                    $scope.initFacets();
                };
                // clear entire searchbar
                $scope.clearSearch = function() {
                    if ($scope.currentSearch.length > 0) {
                        $scope.currentSearch = [];
                        $scope.facetsObj = $scope.copyFacets($scope.facetsSave);
                        $scope.resetState();
                        $scope.$emit('searchUpdated', '');
                        $scope.$emit('textSearch', '', $scope.filter_keys);
                    }
                };
                $scope.isMatchLabel = function(label) {
                    return Array.isArray(label);
                };
                $scope.resetState = function() {
                    searchInput.val('');
                    $scope.filteredObj = $scope.facetsObj;
                    $scope.facetSelected = undefined;
                    $scope.facetOptions = undefined;
                    $scope.filteredOptions = undefined;
                    if ($scope.currentSearch.length === 0) {
                        $scope.strings.prompt = $scope.promptString;
                    }
                };
                // showMenu and hideMenu depend on foundation's dropdown. They need
                // to be modified to work with another dropdown implemenation (i.e. bootstrap)
                $scope.showMenu = function() {
                    $timeout(function() {
                        if ($('#facet-drop').hasClass('open') === false && $scope.filteredObj.length > 0) {
                            $('.search-input').trigger('click');
                        }
                    });
                };
                $scope.hideMenu = function() {
                    $(document).foundation('dropdown', 'closeall');
                };
                $scope.initSearch();
            }
        };
    })
;
