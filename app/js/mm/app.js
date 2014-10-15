'use strict';

angular.module('mm', ['ui.router', 'mms', 'mms.directives', 'ui.bootstrap', 'ui.tree', 'fa.directive.borderLayout'])
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('main', {
        url: '',
        resolve: {
            workspaces: function(WorkspaceService) {
                return WorkspaceService.getWorkspaces();
            },
        },
        views: {
            'menu': {
                template: '<mms-nav mms-type="Model Manager" mms-go-to="false" mms-other-sites="false" mms-ws="master"></mms-nav>'
            },
            'main': {
                templateUrl: 'partials/mm/main.html',
                controller: 'DiffController'
            }
        }
    })   
    .state('main.diff', {
        url: '/diff/:source/:target',
        resolve: {
            /*diff: function($stateParams, WorkspaceService) {
                return WorkspaceService.diff($stateParams.source, $stateParams.target);
            }*/
        },
        views: {
            'main@': {
                templateUrl: 'partials/mm/diff.html',
                controller: 'DiffTreeController'
            }
        }
    })
    .state('main.diff.view', {
        url: '/element/:elementId',
        resolve: {
        },
        views: {
            'view@main.diff': {
                templateUrl: 'partials/mm/diff-view.html',
                controller: 'DiffViewController'
            }
        }
    });
});
