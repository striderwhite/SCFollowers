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

    //-----------------------//
    //         SETUP         //    
    //-----------------------//

    $scope.SCEndpoint = "https://api-v2.soundcloud.com/users/2751638/followers?offset=1501351687918&limit=200&client_id=JlZIsxg2hY5WnBgtn3jfS0UYCl0K8DOg";
    //Set up array of followers
    $scope.followers = [];
    //Lodash
    $scope._ = _;
    //Show table div
    $scope.showTable = false;
    //Show url div
    $scope.showUrl = true;
    //set up sorting stuff
    $scope.sortColumn = "followers_count"
    $scope.reverseSort = true;
    $scope.sortData = function (column) {
        //$scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
        $scope.sortColumn = column
    }
    $scope.information = "waiting...";


    //end sorting stuff

    //-----------------------//
    //         FUNCS         //    
    //-----------------------//
    

    //Get the first set of followers with a promise
    $scope.start = function()
    {
        //VALIDATE THE URL 
        //if ($scope.SCEndpoint != somthing)
        //{
        //    $scope.information = "URL IS WRONG...";
        //}

        //Show table
        $scope.showTable = true;
        //Hide URL div
        $scope.showUrl = false;


        //Make a promise to get data from SC API
        var promise = getFollowers($q, $http, $scope, proxy + $scope.SCEndpoint);
        promise.then((data) => {

            //get the first set of followers
            _.merge($scope.followers, data.collection);
            $scope.followerCount = $scope.followers.length;
            $scope.next_href = data.next_href;

        //Now, depending of next_href is null or not, keep call "next page".
        }).then((response)=>
        {
            if($scope.next_href != null) {
                nextPage();
            }
        });

    }


    //This function keeps calling itself after a promise resolve until that promise rejects
    function nextPage() {
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

            if (data.next_href != null) {
                nextPage();
            }

        //We hit here when promise is rejected
        }, (err) => {
            $scope.next_href = "Done! :)";
        });
    }

});


