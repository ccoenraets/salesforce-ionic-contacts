angular.module('salesforce.oauth', [])

    .factory('OAuthService', function ($q, $window) {

        var apiVersion = 'v30.0',
            client,
            oauthPlugin,
            deferredLogin,

            // Used by browser authentication only -- not Cordova
            clientId = '3MVG9JZ_r.QzrS7iIgijkHLRGgkLjeI.ixzhRw.oKXqbjX9u89DQztkckFj7tklZnS6_1a6hRCsvGEv7eeASC',
            loginUrl = 'https://login.salesforce.com/',
            redirectURI = "http://localhost:3000/oauthcallback.html",
            proxyURL = 'http://localhost:3000/proxy/';

        function authenticateInCordova() {
            oauthPlugin = cordova.require("salesforce/plugin/oauth");

            // Call getAuthCredentials to get the initial session credentials
            oauthPlugin.getAuthCredentials(
                function (creds) {
                    salesforceSessionRefreshed(creds);
                    deferredLogin.resolve();
                },
                function (error) {
                    alert("Authentication Error: " + error);
                    deferredLogin.fail(error);
                });

            // Register to receive notifications when autoRefreshOnForeground refreshes the sfdc session
            document.addEventListener("salesforceSessionRefresh", salesforceSessionRefreshed, false);
        }

        function salesforceSessionRefreshed(creds) {
            // Depending on how we come into this method, `creds` may be callback data from the auth
            // plugin, or an event fired from the plugin.  The data is different between the two.
            var credsData = creds;
            if (creds.data)  // Event sets the `data` object with the auth data.
                credsData = creds.data;

            client = new forcetk.Client(credsData.clientId, credsData.loginUrl, null, oauthPlugin.forcetkRefresh);
            client.setSessionToken(credsData.accessToken, apiVersion, credsData.instanceUrl);
            client.setRefreshToken(credsData.refreshToken);
            client.setUserAgentString(credsData.userAgent);
        }

        function authenticate() {
            deferredLogin = $q.defer();
            if (document.location.protocol === "file:") {
                console.log('Running in Cordova');
                authenticateInCordova();
            } else {
                console.log('Not Running in Cordova');
                authenticateInBrowser()
            }
            return deferredLogin.promise;
        }

        function authenticateInBrowser() {
            var url = loginUrl + 'services/oauth2/authorize?display=popup&response_type=token' +
                '&client_id=' + encodeURIComponent(clientId) +
                '&redirect_uri=' + encodeURIComponent(redirectURI);
            client = new forcetk.Client(clientId, loginUrl, proxyURL),
                popupCenter(url, 'login', 700, 600);
        }

        function oauthCallback(hash) {

            var message = decodeURIComponent(hash.substr(1)),
                params = message.split('&'),
                response = {};
            params.forEach(function (param) {
                var splitter = param.split('=');
                response[splitter[0]] = splitter[1];
            });
            if (response && response.access_token) {
                client.setSessionToken(response.access_token, apiVersion, response.instance_url);
                console.log('authentication succeeded: ' + response.access_token);
                deferredLogin.resolve();
            } else {
                alert("AuthenticationError: No Token");
                deferredLogin.reject();
            }
        }

        function popupCenter(url, title, w, h) {
            // Handles dual monitor setups
            var parentLeft = $window.screenLeft ? $window.screenLeft : $window.screenX;
            var parentTop = $window.screenTop ? $window.screenTop : $window.screenY;
            var left = parentLeft + ($window.innerWidth / 2) - (w / 2);
            var top = parentTop + ($window.innerHeight / 2) - (h / 2);
            return $window.open(url, title, 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        }

        return {
            authenticate: authenticate,
            oauthCallback: oauthCallback,
            getClient: function () {
                return client;
            }
        }

    });

// Global function called back by the OAuth login dialog (browser authetication only -- not Cordova)
function oauthCallback(hash) {
    var injector = angular.element(document.getElementById('view')).injector();
    injector.invoke(function (OAuthService) {
        OAuthService.oauthCallback(hash);
    });
}