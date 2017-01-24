
certbot.angular.controller("homeControl", function ($scope) {

});

certbot.angular.controller("quickstartControl", function ($scope) {

});

certbot.angular.controller("notFoundControl", function ($scope) {

});

certbot.angular.directive('certbotControl', function () {

    return {
        controller: function ($scope, $location) {

            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function'))
                        fn();
                } else
                    this.$apply(fn);
            };

            $scope.serverRequest = function (requestType, url, data, callback, content) {
                console.log($scope.apiBaseURL + url);
                $.ajax({
                    type: requestType,
                    dataType: "json",
                    contentType: "application/" + content,
                    xhrFields: {withCredentials: true},
                    url: $scope.apiBaseURL + url,
                    data: data,
                    timeout: 25000,
                    success: function (response) {
                        $scope.safeApply(function () {
                            debuggable("SUCCESS", function () {
                                console.log(response);
                            });
                            callback && callback(response);
                        });
                    },
                    error: function (response) {
                        $scope.safeApply(function () {
                            debuggable("ERROR", function () {
                                console.log(response);
                            });
                            callback && callback(response);
                        });
                    }
                });
            };

            $scope.requests = {
                logout: function (callback) {
                    var myObject = {};
                    $scope.serverRequest("POST", "logout", myObject, callback, "x-www-form-urlencoded");
                }
            };

            $scope.serverSelect = function () {
                if (location.hostname === "localhost") {
                    $scope.apiBaseURL = null;
                    $scope.baseURL = null;
                } else {
                    $scope.apiBaseURL = null;
                    $scope.baseURL = null;
                }
            };

            $scope.myRouter = function(myRoute){
                $location.path(myRoute);
            };

            $scope.init = function () {
                $scope.serverSelect();
            };

            $scope.init();
        }
    };
});

certbot.angular.directive('userControl', function () {
    return {
        controller: function ($scope, $localStorage) {

            $scope.isValid = function (value) {
                return (typeof value != 'undefined' && value != "");
            };

            $scope.login = function () {
                if ($scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password))
                    $scope.requests.userLogin($scope.guest.email, $scope.guest.password, function (response) {
                        $scope.safeApply(function () {
                            if (response.name) {
                                $localStorage.ngMyUser = response;
                                $scope.ngMyUser = $localStorage.ngMyUser;
                                $scope.loginSuccess();
                            }
                            else showAlert('Wrong username or password.');
                        });
                    });
                else
                    showAlert('Please enter a username & password.');
            };

            $scope.logout = function () {
                $scope.requests.logout(function (response) {
                    $scope.safeApply(function () {
                        if (response.responseText == "Successfully logged out") {
                            $localStorage.$reset();
                            $scope.userReset();
                        }
                    });
                });
            };

            $scope.submitRegister = function () {
                if ($scope.isValid($scope.guest.name) && $scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password))
                    $scope.requests.userRegisterForm($scope.guest.name, $scope.guest.email, $scope.guest.password, function (response) {
                        if (response.name)
                            $scope.login();
                        else if (response.responseText == "User exists.")
                            showAlert('You already have an account.');
                        else showAlert('Please fill the form correctly.');
                    });
                else showAlert('Please fill the form correctly.');
            };

            $scope.userRegister = function () {
                $(".loginContainer").animate({"height": "590px"}, 500);
                $(".loginPanel").hide();
                setTimeout(function () {
                    $(".registerPanel").fadeIn(500);
                }, 200);
                var spacerHeight = $(".loginSpacer").height();
                $(".loginSpacer").animate({"height": spacerHeight - 35}, 500);
            };

            $scope.userReset = function () {
                $scope.ngMyUser = false;
                $scope.accountOptions = false;
                $scope.guest = {};
                certbot.currentUser = null;

                if (certbot.requireLogin) {
                    $scope.requireLogin = true;
                    setTimeout(function () {
                        $('.loginOverlay').fadeIn(500);
                    }, 500);
                } else {
                    $scope.requireLogin = false;
                }
            };

            $scope.accountOptionsTrigger = function () {
                if (!$scope.ngMyUser) $scope.loginButtonClick();
                else $scope.accountOptions = !$scope.accountOptions;
            };

            $scope.loginSuccess = function () {
                $('.alertMessage').hide();
                $('.loginOverlay').hide();
                if (typeof dashboard != 'undefined' && dashboard) showDashboard();
            };

            $scope.init = function () {
                if ($localStorage.ngMyUser)
                    $scope.ngMyUser = $localStorage.ngMyUser;
                else $scope.userReset();

            };

            $scope.init();
        }
    };
});