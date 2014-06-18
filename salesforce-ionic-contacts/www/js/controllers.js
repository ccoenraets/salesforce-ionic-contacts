angular.module('starter.controllers', ['starter.services'])

    .controller('ContactListCtrl', function ($scope, Contacts) {

        $scope.key = "";

        Contacts.all().then(function (contacts) {
            $scope.contacts = contacts;
        });

        $scope.search = function() {
            Contacts.search($scope.key).then(function (contacts) {
                $scope.contacts = contacts;
            });
        };

    })

    .controller('ContactDetailCtrl', function ($scope, $stateParams, Contacts) {
        Contacts.get($stateParams.contactId).then(function (contact) {
            $scope.contact = contact;
        });
    });