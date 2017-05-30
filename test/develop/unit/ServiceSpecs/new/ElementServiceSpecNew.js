'use strict';

describe('Service: ElementService', function() {
	beforeEach(module('mms'));

	var root = '/alfresco/service';
	var $httpBackend;
	var mockURLService, mockUtilsService, mockCacheService, mockHttpService, mockApplicationService;
	var ElementServiceObj;
	var projects = {};
	var ref = {};
	var refs = {};
	var elements = {};
	var result = {};

	beforeEach(inject(function($injector) {
		$httpBackend 			= $injector.get('$httpBackend');
		mockURLService			= $injector.get('URLService');
		mockCacheService		= $injector.get('CacheService');
		mockHttpService			= $injector.get('HttpService');
		mockApplicationService	= $injector.get('ApplicationService');
		ElementServiceObj		= $injector.get('ElementService');

		projects = {
			projects: [
			    {
			        _created	: "2017-04-18T14:56:57.635-0700",
			        _creator	: "gandalf",
			        _elasticId	: "elasticId",
			        _modified	: "2017-04-18T14:56:57.635-0700",
			        _modifier	: "gandalf",
			        _mounts		: [],
			        _projectId	: "projectId",
			        _refId		: "master",
			        categoryId	: "",
			        id 			: "hereisanid",
			        name		: "youshallnotpass",
			        orgId 		: "minesofmoria",
			        twcId 		: "",
			        type 		: "Project",
			        uri 		: "file:/Users/gandalf/Documents/youshallnotpass.mdzip"
			    },
			    {
			        _created 	: "2017-04-19T11:31:07.968-0700",
			        _creator	: "admin",
			        _elasticId	: "elasticId2",
			        _modified	: "2017-04-19T11:31:07.968-0700",
			        _modifier	: "admin",
			        _mounts		: [],
			        _projectId	: "projectId2",
			        _refId 		: "master",
			        categoryId 	: "",
			        id 			: "hereisanotherid",
			        name 		: "thelonelymountain",
			        orgId 		: "Erebor",
			        twcId 		: "",
			        type 		: "Project",
			        uri 		: "file:/Users/admin/Downloads/thelonelymountain.mdzip"
			    }
			]
		}

		$httpBackend.when('GET', '/alfresco/service/projects').respond(200, projects);

		ref = [{
			_elasticId: "refelastic3",
			id: "thirdref",
			name: "thirdref"
		}]


		refs = {
			refs: [
				{
					_elasticId: "refelastic1",
					id: "master",
					name: "master"
				},
				{
					_elasticId: "refelastic2",
					id: "secondref",
					name: "secondref"
				}
			]
		}

		$httpBackend.when('GET', '/alfresco/service/projects/projectId/refs').respond(200, refs);

		elements = {
			elements: [
				{
					_allowedElements			: [],
					_modifier					: "admin",
					powertypeExtentIds			: [],
					representationId			: null,
					mdExtensionsIds				: [],
					templateBindingIds			: [],
					appliedStereotypeInstanceId	: "applid",
					templateParameterId			: null,
					isActive					: false,
					ownerId 					: "ownerid",
					type 						: "Class",
					isLeaf 						: false,
					clientDependencyIds 		: [],
					_displayedElements 			: ["diselements"],
					useCaseIds 					: [],
					syncElementId 				: null,
					classifierBehaviorId 		: null,
					interfaceRealizationIds 	: [],
					id 							: "heyanelement",
					_elasticId 					: "elasticid",
					_refId 						: "master",
					supplierDependencyIds		: [],
					_modified					: "2017-05-03T10:51:50.270-0700",
					_appliedStereotypeIds		: ["stereotypeids"],
					nameExpression				: null,
					ownedAttributeIds			: ["ownedattr1","ownedattr2","ownedattr3","ownedattr4","ownedattr5"],
					packageImportIds			: [],
					visibility					: null,
					substitutionIds				: [],
					documentation				: "",
					redefinedClassifierIds		: [],
					_editable					: true,
					isAbstract					: false,
					_contents:
						{
							type: "Expression",
							operand: [
								{
									instanceId: "instanceid",
									type: "InstanceValue"
								}
							]
						},
					_commitId: "commitid",
					_childViews: [
						{
							aggregation: "composite",
							id: "child1"
						},
						{
							aggregation: "composite",
							id: "child2"
						},
						{
							aggregation: "composite",
							id: "child3"
						},
						{
							aggregation: "composite",
							id: "child4"
						},
						{
							aggregation: "composite",
							id: "child5"
						}
					],
					generalizationIds: [],
					_creator: "admin",
					ownedOperationIds: [],
					_created: "2017-05-01T13:43:19.571-0700",
					name: "Krabby Patties",
					elementImportIds: [],
					collaborationUseIds: [],
					isFinalSpecialization: false,
					_projectId: "heyaproject"
				}
			]
		}

		$httpBackend.when('GET', '/alfresco/service/projects/projectId/refs/master/elements').respond(200, elements);

		result = {
			_modifier					: "admin",
			powertypeExtentIds			: [],
			representationId			: null,
			mdExtensionsIds				: [],
			templateBindingIds			: [],
			appliedStereotypeInstanceId	: "applid",
			templateParameterId			: null,
			isActive					: false,
			ownerId 					: "ownerid",
			type 						: "Class",
			isLeaf 						: false,
			clientDependencyIds 		: [],
			_displayedElements 			: ["diselements"],
			useCaseIds 					: [],
			syncElementId 				: null,
			classifierBehaviorId 		: null,
			interfaceRealizationIds 	: [],
			id 							: "heyanelement",
			_elasticId 					: "elasticid",
			_refId 						: "master",
			supplierDependencyIds 		: [],
			_modified 					: "2017-05-03T10:51:50.270-0700",
			_appliedStereotypeIds 		: ["stereotypeids"],
			nameExpression 				: null,
			ownedAttributeIds 			: ["ownedattr1","ownedattr2","ownedattr3","ownedattr4","ownedattr5"],
			packageImportIds 			: [],
			visibility 					: null,
			substitutionIds 			: [],
			documentation 				: "",
			redefinedClassifierIds 		: [],
			_editable 					: true,
			isAbstract 					: false,
			_contents:
				{
					type: "Expression",
					operand: [
						{
							instanceId: "instanceid",
							type: "InstanceValue"
						}
					]
				},
			_commitId 					: "commitid",
			_childViews: [
				{
					aggregation: "composite",
					id: "child1"
				},
				{
					aggregation: "composite",
					id: "child2"
				},
				{
					aggregation: "composite",
					id: "child3"
				},
				{
					aggregation: "composite",
					id: "child4"
				},
				{
					aggregation: "composite",
					id: "child5"
				}
			],
			generalizationIds 			: [],
			_creator 					: "admin",
			ownedOperationIds 			: [],
			_created 					: "2017-05-01T13:43:19.571-0700",
			name 						: "Krabby Patties",
			elementImportIds 			: [],
			collaborationUseIds 		: [],
			isFinalSpecialization 		: false,
			_projectId 					: "heyaproject"
		}

	}));

	describe('getElement', function() { //problem with MMS with this, MMS-741
		it('should get an element that is not in the cache', function() {
			var elemOb;
			var testElem = {
				projectId: "heyaproject",
				elementId: "heyanelement",
				refId: 'master',
				commitId: 'latest'
			};
			var result = {
					_modifier					: "admin",
					powertypeExtentIds			: [],
					representationId			: null,
					mdExtensionsIds				: [],
					templateBindingIds			: [],
					appliedStereotypeInstanceId	: "applid",
					templateParameterId			: null,
					isActive					: false,
					ownerId 					: "ownerid",
					type 						: "Class",
					isLeaf 						: false,
					clientDependencyIds 		: [],
					_displayedElements 			: ["diselements"],
					useCaseIds 					: [],
					syncElementId 				: null,
					classifierBehaviorId 		: null,
					interfaceRealizationIds 	: [],
					id 							: "heyanelement",
					_elasticId 					: "elasticid",
					_refId 						: "master",
					supplierDependencyIds 		: [],
					_modified 					: "2017-05-03T10:51:50.270-0700",
					_appliedStereotypeIds 		: ["stereotypeids"],
					nameExpression 				: null,
					ownedAttributeIds 			: ["ownedattr1","ownedattr2","ownedattr3","ownedattr4","ownedattr5"],
					packageImportIds 			: [],
					visibility 					: null,
					substitutionIds 			: [],
					documentation 				: "",
					redefinedClassifierIds 		: [],
					_editable 					: true,
					isAbstract 					: false,
					_contents:
						{
							type: "Expression",
							operand: [
								{
									instanceId: "instanceid",
									type: "InstanceValue"
								}
							]
						},
					_commitId 					: "commitid",
					_childViews: [
						{
							aggregation: "composite",
							id: "child1"
						},
						{
							aggregation: "composite",
							id: "child2"
						},
						{
							aggregation: "composite",
							id: "child3"
						},
						{
							aggregation: "composite",
							id: "child4"
						},
						{
							aggregation: "composite",
							id: "child5"
						}
					],
					generalizationIds 			: [],
					_creator 					: "admin",
					ownedOperationIds 			: [],
					_created 					: "2017-05-01T13:43:19.571-0700",
					name 						: "Krabby Patties",
					elementImportIds 			: [],
					collaborationUseIds 		: [],
					isFinalSpecialization 		: false,
					_projectId 					: "heyaproject"
			};
			$httpBackend.when('GET', root + '/projects/heyaproject/refs/master/elements/heyanelement').respond(
				function(method, url, data) {
					return [200, elements];
				});
			ElementServiceObj.getElement(testElem).then(function(data) {
				elemOb = data;
			}, function(reason) {
				elemOb = reason.message;
			});
			$httpBackend.flush();
			expect(elemOb).toEqual(result);
		});
	});

	describe('getElements', function() {
		it('should get elements not in the cache', function() {
			var elemsOb;
			var testElem = {
				projectId: "heyaproject",
				elementId: "heyanelement",
				refId: 'master',
				commitId: 'latest'
			};
			
			$httpBackend.when('GET', root + '/projects/heyaproject/refs/master/elements/heyanelement').respond(
				function(method, url, data) {
					return [200, elements];
				});
			ElementServiceObj.getElement(testElem).then(function(data) {
				elemsOb = data;
			}, function(reason) {
				elemsOb = reason.message;
			});
			$httpBackend.flush();
			expect(elemsOb).toEqual(result);
		});
	});

	xdescribe('cacheElement', function() { //redundant test?
		// it('should cache an element', function() {
		// 	var elemOb;
		// 	var testElem = {
		// 		projectId: "heyaproject",
		// 		elementId: "heyanelement",
		// 		refId: 'master',
		// 		commitId: 'latest'
		// 	};
		// 	ElementServiceObj.cacheElement(testElem).then(function(data) {

		// 	}, function(reason) {
		// 		elemOb = reason.message;
		// 	});
		// 	httpBackend.flush();
		// 	expect().toEqual();
		// });
	});

	xdescribe('getElementForEdit', function() {
		it('should get an element', function() {
			var elemOb;
			var testElem = {
				projectId: "heyaproject",
				elementId: "heyanelement",
				refId: 'master',
				commitId: 'latest'
			};
			$httpBackend.when('GET', root + '/projects/heyaproject/refs/master/elements').respond(
				function(method, url, data) {
					return [200, elements];
				}
			);
			ElementServiceObj.getElementForEdit(testElem).then(function(data) {
				elemOb = data;
			}, function(reason) {
				elemOb = reason.message;
			});
			$httpBackend.flush();
			expect(elemOb).toEqual(result);
		});
	});

	xdescribe('getOwnedElements', function() {
		it('should get an elements owned element objects', function() {

		});
	});

	xdescribe('getGenericElements', function() {
		it('should get an element', function() {

		});
	});

	xdescribe('fillInElement', function() {
		it('should get an element', function() {

		});
	});

	xdescribe('updateElement', function() {
		it('it should save an element to MMS and update the cache if successful', function() {
			var elemOb = null;
			var testElem = {
				_projectId: "heyaproject",
				id: "heyanelement",
				_refId: 'master',
				_commitId: 'latest'
			};
			$httpBackend.when('POST', '/alfresco/service/projects/heyaproject/refs/master/elements', testElem).respond(201, '');
			var testElem = {
				_projectId: "heyaproject",
				id: "heyanelement",
				_refId: 'master',
				_commitId: 'latest'
			};
			ElementServiceObj.updateElement(testElem, false).then(function(data) {
				console.log("hi");
				elemOb = 'hey';
			}, function(reason) {
				console.log("hi you failed");
				elemOb = reason.message;
			});
			console.log("hi after" + elemOb);
			expect(elemOb).toEqual(testElem);
			$httpBackend.flush();
		});
	});

	xdescribe('updateElements', function() {
		it('should get an element', function() {

		});
	});

	xdescribe('createElement', function() {
		it('should get an element', function() {

		});
	});

	xdescribe('createElements', function() {
		it('should get an element', function() {

		});
	});

	xdescribe('isCacheOutdated', function() {
		it('should get an element', function() {

		});
	});

	describe('search', function() {
		it('should get an element', function() {
			var searchText = 'krabby patties';

			var q = {
				id: searchText
			};
			var q2 = {
				query: searchText,
				fields: ["defaultValue.value", "value.value", "specification.value", "name", "documentation"]
			};
			var allQuery = {
				multi_match: q2
			};
			var idQuery = {
				term: q
			};
			var mainQuery = {
               "bool": {
                    "should": [
                        idQuery,
                        allQuery
                    ]
                }				
			};
			var mainBoolQuery =[];
			mainBoolQuery.push(mainQuery, {});
			var queryOb = { //assuming searchType is 'all'
                "sort" : [
                    "_score",
                    { "_modified" : {"order" : "desc"}}
                ],
                "query": {
                    "bool": {
                        "must": mainBoolQuery
                    }
                },
                "from": 21,
                "size": 20
			};
			var testElem = {
				_projectId: "heyaproject",
				_refId: 'master'
			};
			var resultElem = {
				_projectId: "heyaproject",
				id: "heyanelement",
				_refId: 'master',
				_commitId: 'latest'
			};
			$httpBackend.when('POST', '/alfresco/service/projects/heyaproject/refs/master?search=' + searchText).respond(201, resultElem);
			var reqOb = {
				projectId: "heyaproject",
				elementId: "heyanelement",
				refId: 'master',
				commitId: 'latest'
			};
			var elemOb = null;
			ElementServiceObj.search(reqOb, queryOb, 1, 20, 1).then(function(data) {
				elemOb = data;
			}, function(reason) {
				elemOb = reason.message;
			});
			expect(elemOb).toEqual(resultElem);
			$httpBackend.flush();
		});
	});

	xdescribe('getElementHistory', function() {
		it('should get an element', function() {

		});
	});

	xdescribe('getElementKey', function() {
		it('should get an element', function() {

		});
	});

	xdescribe('reset', function() {
		it('should get an element', function() {

		});
	});
})