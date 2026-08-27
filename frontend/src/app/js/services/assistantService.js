angular.module('hospitalApp') // ⚠️ replace 'hospitalApp' with YOUR actual module name
    .service('AssistantService', ['$http', function ($http) {
        this.ask = function (question, codeContext) {
            return $http.post('/api/assistant/ask', {
                question: question,
                codeContext: codeContext
            });
        };
    }]);