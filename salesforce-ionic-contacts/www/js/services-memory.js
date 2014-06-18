angular.module('starter.services', [])

    .factory('Contacts', function ($q) {

        // Some fake testing data
        var contacts = [
            { Id: 0, Name: 'Scruff McGruff', Title: 'CEO', Department: 'Sales' },
            { Id: 1, Name: 'G.I. Joe', Title: 'CEO', Department: 'Sales' },
            { Id: 2, Name: 'Miss Frizzle', Title: 'CEO', Department: 'Sales' },
            { Id: 3, Name: 'Ash Ketchum', Title: 'CEO', Department: 'Sales' }
        ];

        return {
            all: function () {
                return contacts;
            },
            get: function (contactId) {
                return contacts[contactId];
            },
            search: function (key) {
                var results = contacts.filter(function(contact) {
                    return contact.Name.toLowerCase().indexOf(key.toLowerCase()) > -1;
                });
                return results;
            }
        }
    });
