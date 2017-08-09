/// <reference path="APICaller.js" />

//Hard coded url to api call
var scURL = "https://api-v2.soundcloud.com/users/2751638/followers?offset=1501351687918&limit=200&client_id=JlZIsxg2hY5WnBgtn3jfS0UYCl0K8DOg";
//CORS proxy
var proxy = 'https://cors-anywhere.herokuapp.com/';

var token = '&client_id=JlZIsxg2hY5WnBgtn3jfS0UYCl0K8DOg';

var app = angular.module("followersApp", []).config(function ($sceDelegateProvider, $httpProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://api-v2.soundcloud.com/**',
        'https://api.soundcloud.com/**'
    ]);
    $httpProvider.defaults.useXDomain = true;
}).constant('_', window._);


//Controller only concerned with getting followers from SC API
app.controller("followersController", function ($scope, $http, $q, _) {



    //Set up array of followers
    $scope.followers = [];
    //Lodash
    $scope._ = _;

    //Make a promise to get data from SC API
    var promise = getFollowers($q, $http, $scope, proxy + scURL);
    promise.then((data) => {

        //_ = _.noConflict(); // lets call ourselves _u
        //_.merge($scope.followerCount, data.collection);

        //$scope.followers = $scope.followers.concat(data.collection);

        console.log("Attempt INIT merg. Before: " + $scope.followers.length);
        _.merge($scope.followers, data.collection);
        console.log("Attempt INIT merg. After: " + $scope.followers.length);

        $scope.followerCount = $scope.followers.length;
        $scope.next_href = data.next_href;



        //console.log(JSON.stringify($scope.followers));
        //console.log("----------------------------------------------------------------------------------------------------------------------------------------------");
        //console.log(JSON.stringify(data.collection));

    });



    $scope.nextPage = function nextPage() {
        console.log("Getting next page");
        var promise2 = getFollowers($q, $http, $scope, proxy + $scope.next_href + token);
        promise2.then((data) => {
            console.log("Got " + data.collection.length + " new followers");

            console.log("Attempt merg. Before: " + $scope.followers.length);
            //_.merge($scope.followers, data.collection);
            $scope.followers = $scope.followers.concat(data.collection);
            console.log("Attempt merg. After: " + $scope.followers.length);


            $scope.followerCount = $scope.followers.length;
            $scope.next_href = data.next_href;


            //console.log(JSON.stringify($scope.followers));
            //console.log("----------------------------------------------------------------------------------------------------------------------------------------------");
            //console.log(JSON.stringify(data.collection));

            //console.log("$scope.followers before: " + $scope.followers.length);
            //console.log("data before: " + $scope.followers.length);

            //angular.extend($scope.followers, data.collection);
            //console.log("$scope.followers after: " + $scope.followers.length);
            //console.log("data after: " + $scope.followers.length);

            //$scope.followers.concat(data.collection);

            //Object.assign($scope.followers, data.collection);
            //$scope.followerCount = $scope.followers.count;
            //$scope.next_href = data.next_href;
        });
    }

});


