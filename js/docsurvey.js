/**
 * Created by james_r_bray on 10/25/15.
 */
console.debug("Entering application...");


var app = angular.module('docsurveyApp', []);

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

    this.getInstitutions = function() {
        console.debug("Entering surveyService.getInstitutions...");
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://www.jaydot2.com:8080/spring-survey-1.0.0-BUILD-SNAPSHOT/institutions',
            headers: {'Content-Type': 'application/json'}
        }).
            success(function (response) {
                console.debug('http://www.jaydot2.com:8080/spring-survey-1.0.0-BUILD-SNAPSHOT/institutions');
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

    this.getSurveyData = function() {
        console.debug("Entering surveyService.getSurveyData...");
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://www.jaydot2.com:8080/spring-survey-1.0.0-BUILD-SNAPSHOT/surveydata',
            headers: {'Content-Type': 'application/json'}
        }).
            success(function(response) {
                console.debug('http://www.jaydot2.com:8080/spring-survey-1.0.0-BUILD-SNAPSHOT/surveydata');
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
});

app.controller('surveyController', function($log, $scope, surveyService) {
    console.debug("entering surveyController...");
    var survey = this;
    //survey.institutions = [{organizationKey:'MCNI001',organizationName:'Mercy North Iowa',demo:'DEMO'}];
    $scope.institutions = surveyService.initializeInstitutions();
    $scope.surveyData = surveyService.initializeSurveys();

    $scope.getInstitutions = function() {
        //this.institutions = surveyService.getInstitutions();
        var promise = surveyService.getInstitutions();
        promise.then(function(promise) {
            $scope.institutions = promise.data;
        });
        console.debug('The institutions are ' + $scope.institutions);
        console.debug('The institutions are ' + $scope.institutions[0].demo);
    };

    $scope.getSurveyData = function() {
        var surveyPromise = surveyService.getSurveyData();
        surveyPromise.then(function(promise) {
            $scope.surveyData = promise.data;
        });
        console.debug($scope.surveyData);
    };

});