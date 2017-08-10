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

    //determine if on mobile
    $scope.mobile = mobilecheck();
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
    $scope.start = function () {
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
        }).then((response) => {
            if ($scope.next_href != null) {
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


    //export as excel file
    $scope.export = function () {
        var blob = new Blob([document.getElementById('exportTable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Soundcloud-Followers-Report.xls");
    };




    function mobilecheck() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };


});


