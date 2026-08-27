angular.module('hospitalApp') // ⚠️ same module name here
    .controller('AssistantController', ['$scope', 'AssistantService', function ($scope, AssistantService) {
        $scope.question = '';
        $scope.codeContext = '';
        $scope.answer = '';
        $scope.loading = false;

        $scope.ask = function () {
            $scope.loading = true;
            AssistantService.ask($scope.question, $scope.codeContext)
                .then(function (response) {
                    $scope.answer = response.data.answer;
                    $scope.loading = false;
                })
                .catch(function (error) {
                    $scope.answer = 'Error: ' + (error.data ? error.data.error : error.message);
                    $scope.loading = false;
                });
        };
    }]);