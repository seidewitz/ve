'use strict';

angular.module('mms.directives')
.directive('mmsDiffTree', ['$templateCache', '$rootScope', 'DiffService', mmsDiffTree]);

function mmsDiffTree($templateCache, $rootScope, DiffService) {

  var MMSDiffTreeController = function ($scope, $rootScope) {
    // Diff the two workspaces picked in the Workspace Picker
    var response = DiffService.diff('ws1', 'ws2');
    var originals = response.workspace1.elements;
    var deltas = response.workspace2;
    
    var id2node = {};

    $scope.treeData = [];
    $scope.options = {
        types: {
            "Element": "fa fa-square",
            "Property": "fa fa-circle",
            "View": "fa fa-square",
            "Dependency": "fa fa-long-arrow-right",
            "DirectedRelationship": "fa fa-long-arrow-right",
            "Generalization": "fa fa-chevron-right",
            "Package": "fa fa-folder",
            "Connector": "fa fa-expand"
        },
        statuses: {
            "moved": "",
            "added": "",
            "deleted": "",
            "updated": "",
            "conflict": "",
            "resolved": ""
        }
    };

    /*
     * statuses: {
        "moved": {style: "style1", action: "add" }
        ...
       },
       buttons: {
        ["add": { style: "button-style1", callback:function(branch)},
         ...
        ] 
       }
     */

    response.workspace1.elements.forEach(function(e) {
        var node = {};
        node.data = e;
        id2node[e.sysmlid] = node;
        node.label = e.name;
        node.type = e.specialization.type;
        node.children = [];
    });
    response.workspace1.elements.forEach(function(e) {
        if (!id2node.hasOwnProperty(e.owner))
            $scope.treeData.push(id2node[e.sysmlid]);
        else
            id2node[e.owner].children.push(id2node[e.sysmlid]);
    });
    response.workspace2.addedElements.forEach(function(e) {
        var node = {};
        node.data = e;
        id2node[e.sysmlid] = node;
        node.label = e.name;
        node.type = e.specialization.type;
        node.children = [];
        node.status = "added";
    });
    response.workspace2.addedElements.forEach(function(e) {
        if (!id2node.hasOwnProperty(e.owner))
            $scope.treeData.push(id2node[e.sysmlid]);
        else
            id2node[e.owner].children.push(id2node[e.sysmlid]);
    });
    response.workspace2.deletedElements.forEach(function(e) {
        id2node[e.sysmlid].status = "deleted";
    });
    response.workspace2.updatedElements.forEach(function(e) {
        id2node[e.sysmlid].status = "updated";
    });
    response.workspace2.movedElements.forEach(function(e) {
        var ws1node = id2node[e.sysmlid];
        ws1node.status = "moved";
        //id2node[e.owner].children.push(ws1node);
    });

    $scope.loadTableWithElement = function(sysmlid) {
      if ($rootScope.workspaces !== null) {
        var originalElements = $rootScope.workspaces.workspace1.elements;
        var conflicts = $rootScope.workspaces.workspace2.conflicts;
        var movedElements = $rootScope.workspaces.workspace2.movedElements;
        var updatedElements = $rootScope.workspaces.workspace2.updatedElements;
        var addedElements = $rootScope.workspaces.workspace2.addedElements;
        var deletedElements = $rootScope.workspaces.workspace2.deletedElements;
        console.log(deltas.updatedElements.length);

        $rootScope.tableElement = originalElements.filter(function(entry) {
            return entry && entry.sysmlid.indexOf(sysmlid) !== -1;
          })[0];

        if ($rootScope.tableElement === undefined) {
          $rootScope.tableElement = addedElements.filter(function(entry) {
            return entry && entry.sysmlid.indexOf(sysmlid) !== -1;
          })[0];
        }

        for(var i=0; i < conflicts.length; i++) {
          if(conflicts[i].sysmlid === $rootScope.tableElement.sysmlid){
             $rootScope.conflictElement = conflicts[i];
             $rootScope.mergeConflict = true;
          } else {
            $rootScope.conflictElement = null;
            $rootScope.mergeConflict = false;
          }
        }

        for(var j=0; j < movedElements.length; j++) {
          if(movedElements[j].sysmlid === $rootScope.tableElement.sysmlid) {
            $rootScope.movedElement = movedElements[j];
            $rootScope.elementMoved = true;
          } else {
            $rootScope.movedElement = null;
            $rootScope.elementMoved = false;
          }
        }

        for(var k=0; k < updatedElements.length; k++) {
          if(updatedElements[k].sysmlid === $rootScope.tableElement.sysmlid) {
            $rootScope.updatedElement = updatedElements[k];
            $rootScope.elementUpdated = true;
          } else {
            $rootScope.updatedElement = null;
            $rootScope.elementUpdated = false;
          }
        }

        for(var m=0; m < addedElements.length; m++){
          if(addedElements[m].sysmlid === $rootScope.tableElement.sysmlid) {
            $rootScope.addedElement = addedElements[m];
            $rootScope.elementAdded = true;
          } else {
            $rootScope.addedElement = null;
            $rootScope.elementAdded = false;
          }
        }

        for(var n=0; n < deletedElements.length; n++){
          if(deletedElements[n].sysmlid === $rootScope.tableElement.sysmlid) {
            $rootScope.deletedElement = deletedElements[n];
            $rootScope.elementDeleted = true;
          } else {
            $rootScope.deletedElement = null;
            $rootScope.elementDeleted = false;
          }
        }
      }
    };

  };

  var MMSDiffTreeLink = function (scope, element, attrs) {
    scope.epsilon = [];

    scope.stageChange = function(sysmlid) {
      var deltas = [];
      var workspace2 = $rootScope.workspaces.workspace2;
      workspace2.forEach(function(diffType) {
        diffType.forEach(function(elem) {
          deltas.push(elem);
        });
      });

      // Get the element ref'd by sysmlid in deltas
      var elem = deltas.filter(function(entry) {
            return entry && entry.name.indexOf(sysmlid) !== -1;
          })[0];

      scope.epsilon.push();
    };

    // Send epsilon to the server
    scope.submitAllChanges = function() {
    };

    // Delete epsilon and return to workspace picker state
    scope.cancelAllChanges = function() {
    };
  };
  
  var MMSDiffTreeTemplate = $templateCache.get('mms/templates/mmsDiffTree.html');

  return {
    restrict: 'E',
    template: MMSDiffTreeTemplate,
    link: MMSDiffTreeLink,
    controller: ['$scope', '$rootScope', MMSDiffTreeController]
  };
}