var certbot = {
    angular: null,
    debug: true,
    currentPage: null,
    currentUser: null,
    requireLogin: false,
    pages: {
        home: 0,
        notFound: 1
    },
    userRoles: {
        admin: 0
    }
};

certbot.angular = angular.module('certbot', ['ngRoute', 'ngMaterial']);

certbot.angular.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            controller: "homeControl"
        }).when("/quickstart", {
            templateUrl: "templates/quickstart.html",
            controller: "quickstartControl"
        })
        .otherwise({
            templateUrl: "templates/not-found.html",
            controller: "notFoundControl"
        });
});


