/**
 * Created by james_r_bray on 10/25/15.
 */
console.debug("Entering application...");


var app = angular.module('docsurveyApp', []);
//var baseUrl = 'http://www.jaydot2.com:8080/spring-survey-1.0.0-BUILD-SNAPSHOT';
var baseUrl = 'http://www.docsatisfaction.com:8080/spring-survey-1.0.0-BUILD-SNAPSHOT';
//var baseUrl = 'http://localhost:8080/spring';

app.service('surveyService', function($http, $q, $log) {
    console.debug("Entering surveyService...");

    //var deferred = $q.defer();
    var data = new Array();

    this.initializeInstitution = function() {
        return {
            demo: "",
            organizationKey: "",
            organizationName: ""
        };
    };

    this.initializeInstitutions = function() {
        return [{
            demo: "",
            organizationKey: "",
            organizationName: ""
        }];
    };

    this.institution = this.initializeInstitution();

    this.initializeSurvey = function() {
        return {
            id: "",
            rating: "",
            whyFeeling: "",
            workDissatisfaction: "",
            answerMatrix: "",
            questionAnswer: "",
            comment: "",
            key: ""
        };
    };

    this.initializeSurveys = function() {
        return [{
            id: "",
            rating: "",
            whyFeeling: "",
            workDissatisfaction: "",
            answerMatrix: "",
            questionAnswer: "",
            comment: "",
            key: ""
        }];
    };

    this.survey = this.initializeSurvey();

    /**
     *
     * @returns {promise.promise|jQuery.promise|d.promise|promise|jQuery.ready.promise|qFactory.Deferred.promise|*}
     */
    this.getInstitutions = function() {
        console.debug("Entering surveyService.getInstitutions...");
        var deferred = $q.defer();
        var serviceUrl = baseUrl + '/institutions';
        console.debug('The URL is ' + serviceUrl);
        $http({
            method: 'GET',
            url: serviceUrl,
            headers: {'Content-Type': 'application/json'}
        }).
            success(function (response) {
                console.debug(serviceUrl);
                deferred.resolve({data: response.data});
                data = response.data;
                console.debug(data);  //FOR DEBUG PURPOSES ONLY
            }).
            error(function () {
                console.error("Service call failure...");
                data = "{'message' : 'error'}";
                deferred.reject(data);
                //return "error";
            });
        console.debug("Org Key:" + data.organizationKey);
        console.debug("Exiting surveyService.getInstitutions...");
        return deferred.promise;
    };

    /**
     *
     * @returns {promise.promise|jQuery.promise|d.promise|promise|jQuery.ready.promise|qFactory.Deferred.promise|*}
     */
    this.getSurveyData = function() {
        console.debug("Entering surveyService.getSurveyData...");
        var deferred = $q.defer();
        var serviceUrl = baseUrl + '/surveydata';
        console.debug('The URL is ' + serviceUrl);
        $http({
            method: 'GET',
            url: serviceUrl,
            headers: {'Content-Type': 'application/json'}
        }).
            success(function(response) {
                console.debug(serviceUrl);
                deferred.resolve({data: response.data});
                data = response.data;
                console.debug(data);  //FOR DEBUG PURPOSES ONLY
            }).
            error(function(){
                console.error("Service call failure...");
                $log.error('Service call failed while performing getSurveyData function...');
                data = "{'message' : 'error'}";
                deferred.reject(data);
            });
        console.debug("Exiting surveyService.getSurveyData...");
        return deferred.promise;
    };

    /**
     *
     * @param formData
     */
    this.addInstitution = function(formData) {
        console.debug("Entering surveyService.addInstitution...");
        var deferred = $q.defer();
        var serviceUrl = baseUrl + '/neworg';
        console.debug('The URL is ' + serviceUrl);
        $http({
            method: "POST",
            url: serviceUrl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param(formData)
        }).
            success(function(response){
                deferred.resolve({data: response});
                console.debug(response);
                console.info("New institution added");
            }).
            error(function() {
                console.error("Error occurred while attempting to add a new institution");
                $log.error('Error occurred while attempting to add a new institution');
                data = "{'message' : 'error'}";
                deferred.reject(data);
            });
        console.debug("Exiting surveyService.addInstitution...");
    };
});

app.controller('surveyController', function($log, $scope, surveyService) {
    console.debug("entering surveyController...");
    var survey = this;
    //survey.institutions = [{organizationKey:'MCNI001',organizationName:'Mercy North Iowa',demo:'DEMO'}];
    $scope.institutions = surveyService.initializeInstitutions();
    $scope.surveyData = surveyService.initializeSurveys();
    $scope.addInstitutionFormData = {};

    /**
     *
     */
    $scope.getInstitutions = function() {
        //this.institutions = surveyService.getInstitutions();
        var promise = surveyService.getInstitutions();
        promise.then(function(promise) {
            $scope.institutions = promise.data;
        });
        console.debug('The institutions are ' + $scope.institutions);
        console.debug('The institutions are ' + $scope.institutions[0].demo);
    };

    /**
     *
     */
    $scope.getSurveyData = function() {
        var surveyPromise = surveyService.getSurveyData();
        surveyPromise.then(function(promise) {
            $scope.surveyData = promise.data;
        });
        console.debug($scope.surveyData);
    };

    /**
     *
     */
    $scope.addInstitution = function() {
        console.debug("Try to add an institution");
        console.debug($scope.addInstitutionFormData);
        surveyService.addInstitution($scope.addInstitutionFormData);
    };

});