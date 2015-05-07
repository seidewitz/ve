'use strict';

angular.module('mms.directives')
.directive('mmsTranscludeDoc', ['Utils','ElementService', 'UtilsService', '$compile', '$log', '$templateCache', '$rootScope', '$modal', 'growl', mmsTranscludeDoc]);

/**
 * @ngdoc directive
 * @name mms.directives.directive:mmsTranscludeDoc
 *
 * @requires mms.ElementService
 * @requires mms.UtilsService
 * @requires $compile
 *
 * @restrict E
 *
 * @description
 * Given an element id, puts in the element's documentation binding, if there's a parent 
 * mmsView directive, will notify parent view of transclusion on init and doc change,
 * and on click. Nested transclusions inside the documentation will also be registered.
 * 
 * ## Example
 *  <pre>
    <mms-transclude-doc mms-eid="element_id"></mms-transclude-doc>
    </pre>
 *
 * @param {string} mmsEid The id of the element whose doc to transclude
 * @param {string=master} mmsWs Workspace to use, defaults to master
 * @param {string=latest} mmsVersion Version can be alfresco version number or timestamp, default is latest
 */
function mmsTranscludeDoc(Utils, ElementService, UtilsService, $compile, $log, $templateCache, $rootScope, $modal, growl) {

    var mmsTranscludeDocCtrl = function ($scope) {

        $scope.elementSaving = false;

        $scope.callDoubleClick = function(value) {
            growl.info(value.type);
        };
    };

    var mmsTranscludeDocLink = function(scope, element, attrs, controllers) {

        var mmsViewCtrl = controllers[0];
        var mmsViewElemRefTreeCtrl = controllers[1];

        var processed = false;
        scope.cfType = 'doc';

        element.click(function(e) {
            if (mmsViewCtrl)
                mmsViewCtrl.transcludeClicked(scope.mmsEid);
            if (mmsViewElemRefTreeCtrl)
                mmsViewElemRefTreeCtrl.toggleWireFrame();
            if (e.target.tagName !== 'A' && e.target.tagName !== 'INPUT')
                return false;
            //e.stopPropagation();
        });

        var recompile = function() {
            element.empty();
            var doc = scope.element.documentation;
            if (!doc)
                doc = '<p ng-class="{placeholder: version!=\'latest\'}">(no documentation)</p>';
            element.append(doc);
            $compile(element.contents())(scope); 
            if (mmsViewCtrl) {
                mmsViewCtrl.elementTranscluded(scope.element);
            }
        };

        scope.$watch('mmsEid', function(newVal, oldVal) {
            if (!newVal || (newVal === oldVal && processed))
                return;
            processed = true;
            if (UtilsService.hasCircularReference(scope, scope.mmsEid, 'doc')) {
                element.html('<span class="error">Circular Reference!</span>');
                //$log.log("prevent circular dereference!");
                return;
            }
            var ws = scope.mmsWs;
            var version = scope.mmsVersion;
            if (mmsViewCtrl) {
                var viewVersion = mmsViewCtrl.getWsAndVersion();
                if (!ws)
                    scope.ws = viewVersion.workspace;
                if (!version)
                    version = viewVersion.version;
            }
            scope.version = version ? version : 'latest';
            ElementService.getElement(scope.mmsEid, false, ws, version)
            .then(function(data) {
                scope.element = data;
                recompile();
                scope.$watch('element.documentation', recompile);
            }, function(reason) {
                element.html('<span class="error">doc cf ' + newVal + ' not found</span>');
                growl.error('Cf Doc Error: ' + reason.message + ': ' + scope.mmsEid);
            });
        });

        if (mmsViewCtrl && mmsViewElemRefTreeCtrl) {

            scope.getInstance = function() {
                return mmsViewElemRefTreeCtrl.getInstanceId();
            };

            var editCallBack = function(instanceVal, presentationElem) {

                ElementService.getElementForEdit(scope.mmsEid, false, scope.ws)
                .then(function(data) {
                    scope.edit = data;
                    element.empty();
                    element.append('<textarea ng-model="edit.documentation" mms-tinymce mms-tinymce-api="tinymceApi" mms-ws="{{ws}}" mms-site="{{mmsSite}}" mms-cf-elements="mmsCfElements" mms-eid="{{element.sysmlid}}"></textarea>');
                    $compile(element.contents())(scope); 

                    // Broadcast message for the toolCtrl:
                    $rootScope.$broadcast('presentationElem.edit',scope.edit, scope.ws);

                    mmsViewCtrl.toggleEditing(instanceVal);
                }, function(reason) {
                    if (reason.type === 'info')
                        growl.info(reason.message);
                    else if (reason.type === 'warning')
                        growl.warning(reason.message);
                    else if (reason.type === 'error')
                        growl.error(reason.message);
                });

                // TODO: Should this check the entire or just the instance specification
                // TODO: How smart does it need to be, since the instance specification is just a reference.
                // Will need to unravel until the end to check all references
                ElementService.isCacheOutdated(scope.mmsEid, scope.ws)
                .then(function(data) {
                    if (data.status && data.server.modified > data.cache.modified)
                        growl.warning('This element has been updated on the server');
                });

            };

            var saveCallBack = function(instanceVal, presentationElem) {

                if (scope.elementSaving) {
                    growl.info('Please Wait...');
                    return;
                }
                scope.elementSaving = true;

                Utils.save(scope.edit, scope.ws, "element", scope.mmsEid, null, scope).then(function(data) {
                    scope.elementSaving = false;
                    growl.success('Save Successful');

                    // Broadcast message for the toolCtrl:
                    $rootScope.$broadcast('presentationElem.save',scope.edit, scope.ws);
                    mmsViewCtrl.removeOpenEdit(instanceVal);
                    mmsViewCtrl.toggleEditing(instanceVal);
                }, function(reason) {
                    scope.elementSaving = false;
                    if (reason.type === 'info')
                        growl.info(reason.message);
                    else if (reason.type === 'warning')
                        growl.warning(reason.message);
                    else if (reason.type === 'error')
                        growl.error(reason.message);
                }).finally(function() {
                });

            };

            var cancelCallBack = function(instanceVal) {

                var instance = $modal.open({
                    templateUrl: 'partials/mms/cancelConfirm.html',
                    scope: scope,
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
                        $scope.ok = function() {
                            $modalInstance.close('ok');
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                        };
                    }]
                });
                instance.result.then(function() {
                     // Broadcast message for the toolCtrl:
                    $rootScope.$broadcast('presentationElem.cancel',scope.edit, scope.ws);
                    mmsViewCtrl.removeOpenEdit(instanceVal);
                    mmsViewCtrl.toggleEditing(instanceVal);
                    recompile();
                });
            };

            // Register callbacks:
            mmsViewElemRefTreeCtrl.registerCallBackFnc(saveCallBack, "save");
            mmsViewElemRefTreeCtrl.registerCallBackFnc(editCallBack, "edit");
            mmsViewElemRefTreeCtrl.registerCallBackFnc(cancelCallBack, "cancel");

        }

    };

    return {
        restrict: 'E',
        scope: {
            mmsEid: '@',
            mmsWs: '@',
            mmsVersion: '@'
        },
        require: ['?^mmsView','?^mmsViewElemRefTree'],
        controller: ['$scope', mmsTranscludeDocCtrl],
        link: mmsTranscludeDocLink
    };
}