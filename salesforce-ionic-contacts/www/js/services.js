angular.module('starter.services', [])

    .factory('Contacts', function ($q, $rootScope, OAuthService) {

        function query(queryStr) {
            var deferred = $q.defer();
            OAuthService.getClient().query(queryStr,
                function (response) {
                    var contacts = response.records;
                    deferred.resolve(contacts);
                },
                function (error) {
                    alert(JSON.stringify(error));
                    deferred.fail(error);
                });
            return deferred.promise;
        }

        return {
            all: function () {
                return query('SELECT Id, Name, Title FROM contact LIMIT 50');
            },

            search: function (searchKey) {
                return query('SELECT Id, Name, Title FROM contact WHERE name LIKE \'%' + searchKey + '%\' LIMIT 50');
            },

            get: function (contactId) {
                var deferred = $q.defer();
                OAuthService.getClient().retrieve('Contact', contactId, ['Id', 'Name', 'Title', 'Department', 'Phone', 'MobilePhone', 'Email'],
                    function (contact) {
                        deferred.resolve(contact);
                    },
                    function (error) {
                        alert(JSON.stringify(error));
                        deferred.fail(error);
                    });
                return deferred.promise;
            }

        }
    });
