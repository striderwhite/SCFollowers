/// <reference path="angular.js" />
var scURL = "https://api-v2.soundcloud.com/users/2751638/followers?offset=1501351687918&limit=200&client_id=JlZIsxg2hY5WnBgtn3jfS0UYCl0K8DOg";
//var scURL = "https://api-v2.soundcloud.com/users/270369011/followers?client_id=JlZIsxg2hY5WnBgtn3jfS0UYCl0K8DOg&limit=200&offset=0"
//CORS proxy
var proxy = 'https://cors-anywhere.herokuapp.com/';


//create module then register sc API as a safe source
//see https://stackoverflow.com/questions/41642646/angularjs-errors-blocked-loading-resource-from-url-not-allowed-by-scedelegate
var app = angular.module("followersApp", []).config(function ($sceDelegateProvider,$httpProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://api-v2.soundcloud.com/**',
        'https://api.soundcloud.com/**'
    ]);
    $httpProvider.defaults.useXDomain = true;
});

app.controller("followersController",function ($scope, $http, $q) {


});



function getNextSetOfFollowers($scope, $http) {
    console.log("Calling " + $scope.next_href);
    $http.get(proxy + $scope.next_href, {
        method: 'GET'
    }).then(function success(response) {
        $scope.next_href = response.data.next_href;
        $scope.URLS.push(response.data.next_href);
        return response.data.next_href == null;
    });
}



function buildListOfURL($scope, $http, $q) {
    var next_href = scURL;
    $scope.URLS = [];

    do {
        console.log("Calling " + next_href);
        $http.get(proxy + next_href, {
            method: 'GET'
        }).then(function success(response) {
            $scope.URLS.push(response.data.next_href);
            $scope.next_href = response.data.next_href;
        });
    } while (next_href != null)

}


function getFollowers($scope, $http) {



    $http.get(proxy + scURL, {
        method: 'GET'
    }).then(function successCallback(response) {

        //keep appending data until done
        while ($scope.next_href != null)
        {

            $scope.users += response.data;
            $scope.next_href = response.data.next_href;
        }




        //ERROR HANDLE
    }, function errorCallback(response) {
        $scope.users = response.data;
    });
}