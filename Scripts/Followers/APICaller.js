function getFollowers($q, $http, $scope, endpoint)
{
    return $q(function(resolve,reject)
    {
        $http({
            method: 'GET',
            url: endpoint
        }).then((response) => {
            resolve(response.data);
        }, (err) =>{
            reject(err);
        })
    })

}
