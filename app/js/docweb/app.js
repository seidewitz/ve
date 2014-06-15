'use strict';

angular.module('myApp', ['ui.router', 'mms', 'mms.directives', 'fa.directive.borderLayout', 'ui.bootstrap'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('docweb', {
            url: '/sites/:site',
            resolve: {
                site: function($stateParams, SiteService) {
                    return SiteService.getSite($stateParams.site);
                },
                configs: function($stateParams, ConfigService) {
                    return ConfigService.getSiteConfigs($stateParams.site, 'master');
                }
            },
            views: {
                'menu': {
                    template: '<mms-nav site="{{site}}" title="{{title}}" type="docweb"></mms-nav>',
                    controller: function($scope, $stateParams, site) {
                        $scope.site = site.title;
                        $scope.title = "DocWeb";
                    }
                },
                'config': {
                    templateUrl: 'partials/docweb/config.html',
                    controller: 'ConfigsCtrl'
                }
            }
        })
        .state('docweb.latest', {
            url: '/latest',
            resolve: {
                products: function(site, ViewService) {
                    return ViewService.getSiteDocuments(site.name, null, 'master', null);
                }
            },
            views: {
                'view@': {
                    templateUrl: 'partials/docweb/latest.html',
                    controller: function($scope, site, products) {
                        $scope.products = products;
                        $scope.site = site.title;
                    }
                }
            }
        })
        .state('docweb.new', {
            url: '/new',
            resolve: {
                products: function(site, ViewService) {
                    return ViewService.getSiteDocuments(site.name, null, 'master', null);
                }
            },
            views: {
                'view@': {
                    templateUrl: 'partials/docweb/new.html',
                    controller: 'NewCtrl'
                }
            }
        })
        .state('docweb.config', {
            url: '/config/:configId',
            resolve: {
                config: function($stateParams, site, ConfigService) {
                    return ConfigService.getConfig($stateParams.configId, site.name, 'master');
                },
                snapshots: function($stateParams, site, ConfigService) {
                    return ConfigService.getConfigSnapshots($stateParams.configId, site.name, 'master');
                }
            },
            views: {
                'view@': {
                    templateUrl: 'partials/docweb/config-view.html',
                    controller: 'ConfigCtrl'
                }
            }
        });
    });
