/**
 * @fileOverview Magic Search JS
 * @requires AngularJS
 *
 */
angular.module('MagicSearch', $(document).foundation ? [] : ['ui.bootstrap'])
    .directive('magicSearch', function($compile) {
        return {
            restrict: 'E',
            scope: {
                facets_json: '@facets',
                filter_keys: '=filterKeys',
                strings: '=strings'
            },
            templateUrl: function (scope, elem) {
                return elem.template;
            },
            controller: function ($scope, $timeout) {
                $scope.currentSearch = [];
                $scope.initSearch = function() {
                    // Parse facets JSON and convert to a list of facets.
                    var facetsJson = $scope.facets_json.replace(/__apos__/g, "\'").replace(/__dquote__/g, '\\"').replace(/__bslash__/g, "\\");
                    $scope.facetsObj = JSON.parse(facetsJson);
                    // set facets selected and remove them from facetsObj
                    var initialFacets = window.location.search;
                    if (initialFacets.indexOf('?') === 0) {
                        initialFacets = initialFacets.slice(1);
                    }
                    initialFacets = initialFacets.split('&');
                    if (initialFacets.length > 1 || initialFacets[0].length > 0) {
                        $timeout(function() {
                            $scope.strings['prompt'] = '';
                        });
                    }
                    angular.forEach(initialFacets, function(facet, idx) {
                        var facetParts = facet.split('=');
                        angular.forEach($scope.facetsObj, function(value, idx) {
                            if (value.name == facetParts[0]) {
                                if (value.name == 'tags') {
                                    $scope.currentSearch.push({'name':facet, 'label':[value.label, facetParts[1]]});
                                    // allow tags to stay since we can have multiples
                                }
                                else {
                                    angular.forEach(value.options, function(option, idx) {
                                        if (option.key == facetParts[1]) {
                                            $scope.currentSearch.push({'name':facet, 'label':[value.label, option.label]});
                                            $scope.deleteFacetSelection(facetParts);
                                        }
                                    });
                                }
                            }
                        });
                    });
                    $scope.filteredObj = $scope.facetsObj;
                };
                // removes a facet from the menu
                $scope.deleteFacetSelection = function(facet_parts) {
                    angular.forEach($scope.facetsObj.slice(), function(facet, idx) {
                        if (facet.name == facet_parts[0]) {
                            for (var i=0; i<facet.options.length; i++) {
                                var option = facet.options[i];
                                if (option.key == facet_parts[1]) {
                                    $scope.facetsObj[idx].options.splice($scope.facetsObj[idx].options.indexOf(option), 1);
                                }
                            }
                            if (facet.options.length === 0) {
                                $scope.facetsObj.splice($scope.facetsObj.indexOf(facet), 1);
                            }
                        }
                    });
                };
                $('#search-input').on('keypress', function($event) {
                    var search_val = $('#search-input').val();
                    var i, idx, label;
                    var key = $event.which || $event.keyCode || $event.charCode;
                    if (key == 8 || key == 46) {
                        search_val = search_val.substring(0, search_val.length-1);
                    } else {
                        if (key != 13 && key != 9 && key != 27) {
                            search_val = search_val + String.fromCharCode(key).toLowerCase();
                        }
                    }
                    if (search_val == ' ') {  // space and field is empty, show menu
                        $scope.showMenu();
                        $timeout(function() {
                            $('#search-input').val('');
                        });
                        return;
                    }
                    if (key == 9) {  // tab, so select facet if narrowed down to 1
                        $event.preventDefault();
                        if ($scope.facetSelected === undefined) {
                            if ($scope.filteredObj.length != 1) return;
                            $scope.facetClicked(0, '', $scope.filteredObj[0].name);
                        }
                        else {
                            if ($scope.filteredOptions.length != 1) return;
                            $scope.optionClicked(0, '', $scope.filteredOptions[0].key);
                            $scope.resetState();
                        }
                        $timeout(function() {
                            $('#search-input').val('');
                        });
                        return;
                    }
                    if (key == 27) {  // esc, so cancel and reset everthing
                        $timeout(function() {
                            $scope.hideMenu();
                            $('#search-input').val('');
                        });
                        $scope.resetState();
                        $scope.$emit('textSearch', '', $scope.filter_keys);
                        return;
                    }
                    if (search_val === '') {
                        $scope.filteredObj = $scope.facetsObj;
                        $scope.$emit('textSearch', '', $scope.filter_keys);
                        return;
                    }
                    if (key == 13) {  // enter, so accept value
                        // if tag search, treat as regular facet
                        if ($scope.facetSelected && $scope.facetSelected.name == 'tags') {
                            var curr = $scope.facetSelected;
                            curr.name = curr.name + '=' + search_val;
                            curr.label[1] = search_val;
                            $scope.currentSearch.push(curr);
                            $scope.resetState();
                            $scope.emitQuery();
                            $scope.showMenu();
                        }
                        // if text search treat as search
                        else {
                            for (i=0; i<$scope.currentSearch.length; i++) {
                                if ($scope.currentSearch[i].name.indexOf('text') === 0) {
                                    $scope.currentSearch.splice(i, 1);
                                }
                            }
                            $scope.currentSearch.push({'name':'text='+search_val, 'label':['text', search_val]});
                            $scope.$apply();
                            $scope.hideMenu();
                            $('#search-input').val('');
                            $scope.$emit('textSearch', search_val, $scope.filter_keys);
                        }
                        $scope.filteredObj = $scope.facetsObj;
                    }
                    else {
                        // try filtering facets/options.. if no facets match, do text search
                        var filtered = [];
                        if ($scope.facetSelected === undefined) {
                            $scope.filteredObj = $scope.facetsObj;
                            for (i=0; i<$scope.filteredObj.length; i++) {
                                var facet = $scope.filteredObj[i];
                                idx = facet.label.toLowerCase().indexOf(search_val);
                                if (idx > -1) {
                                    label = [facet.label.substring(0, idx), facet.label.substring(idx, idx + search_val.length), facet.label.substring(idx + search_val.length)];
                                    filtered.push({'name':facet.name, 'label':label, 'options':facet.options});
                                }
                            }
                            if (filtered.length > 0) {
                                $scope.showMenu();
                                $timeout(function() {
                                    $scope.filteredObj = filtered;
                                }, 0.1);
                            }
                            else {
                                $scope.$emit('textSearch', search_val, $scope.filter_keys);
                                $scope.hideMenu();
                            }
                        }
                        else {  // assume option search
                            $scope.filteredOptions = $scope.facetOptions;
                            if ($scope.facetOptions === undefined) { // no options, assume free text like w/ tags
                                return;
                            }
                            for (i=0; i<$scope.filteredOptions.length; i++) {
                                var option = $scope.filteredOptions[i];
                                idx = option.label.toLowerCase().indexOf(search_val);
                                if (idx > -1) {
                                    label = [option.label.substring(0, idx), option.label.substring(idx, idx + search_val.length), option.label.substring(idx + search_val.length)];
                                    filtered.push({'key':option.key, 'label':label});
                                }
                            }
                            if (filtered.length > 0) {
                                $scope.showMenu();
                                $timeout(function() {
                                    $scope.filteredOptions = filtered;
                                }, 0.1);
                            }
                        }
                    }
                });
                // enable text entry when mouse clicked anywhere in search box
                $('#search-main-area').on("click", function($event) {
                    $('#search-input').trigger("focus");
                    if ($scope.facetSelected === undefined) {
                        $scope.showMenu();
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
                    if (name != 'tags') {
                        $scope.filteredOptions = $scope.facetOptions = facet.options;
                        $scope.showMenu();
                    }
                    $timeout(function() {
                        $('#search-input').val('');
                    });
                    $scope.strings['prompt'] = '';
                    $timeout(function() {
                        $('#search-input').focus();
                    });
                };
                // when option clicked, complete facet and send event
                $scope.optionClicked = function($index, $event, name) {
                    $scope.hideMenu();
                    var curr = $scope.facetSelected;
                    curr.name = curr.name + '=' + name;
                    curr.label[1] = $scope.facetOptions[$index].label;
                    $scope.currentSearch.push(curr);
                    $scope.resetState();
                    $scope.emitQuery();
                    $scope.showMenu();
                };
                // send event with new query string
                $scope.emitQuery = function(removed) {
                    var query = '';
                    for (var i=0; i<$scope.currentSearch.length; i++) {
                        if ($scope.currentSearch[i].name.indexOf('text') !== 0) {
                            if (query.length > 0) query = query + "&";
                            query = query + $scope.currentSearch[i].name;
                        }
                    }
                    if (removed !== undefined && removed.indexOf('text') === 0) {
                        $scope.$emit('textSearch', '', $scope.filter_keys);
                    }
                    else {
                        $scope.$emit('searchUpdated', query);
                        if ($scope.currentSearch.length > 0) {
                            var newFacet = $scope.currentSearch[$scope.currentSearch.length-1].name;
                            if (newFacet.indexOf('tags=') !== 0) {
                                $scope.deleteFacetSelection(newFacet.split('='));
                            }
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
                        $('#search-input').val('');
                    }
                    // facet re-enabled by reload
                };
                // clear entire searchbar
                $scope.clearSearch = function() {
                    if ($scope.currentSearch.length > 0) {
                        $scope.currentSearch = [];
                        $scope.facetSelected = undefined;
                        $('#search-input').val('');
                        $scope.$emit('searchUpdated', '');
                        $scope.$emit('textSearch', '', $scope.filter_keys);
                    }
                };
                $scope.isMatchLabel = function(label) {
                    return Array.isArray(label);
                };
                $scope.resetState = function() {
                    $('#search-input').val('');
                    $scope.facetSelected = undefined;
                    $scope.filteredObj = $scope.facetsObj;
                    $scope.facetOptions = undefined;
                    $scope.filteredOptions = $scope.facetOptions;
                };
                // showMenu and hideMenu depend on foundation's dropdown. They need
                // to be modified to work with another dropdown implemenation (i.e. bootstrap)
                $scope.isOpen = false;
                $scope.showMenu = function() {
                    $scope.isOpen = true;                        
                    if($(document).foundation) {
                        $timeout(function() {
                            if ($('#facet-drop').hasClass('open') === false) {
                                $('#search-input').trigger('click');
                            }
                        });
                    }
                };
                $scope.hideMenu = function() {
                    $scope.isOpen = false;
                    if($(document).foundation) {
                        $(document).foundation('dropdown', 'closeall');
                    }
                };
                $scope.initSearch();
            }
        };
    })
;