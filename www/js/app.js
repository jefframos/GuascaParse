// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
Parse.initialize("tC7leffGhsTYhp345AMYksXLdOzoqnrOCmp0DCBq", "JYdpSYrDt4rCfGCTOOW3TLkHbJIFlQOQTnnsdsQu");

window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
      appId      : '149084035430560', // Facebook App ID
      status     : true,  // check Facebook Login status
      cookie     : true,  // enable cookies to allow Parse to access the session
      xfbml      : true,  // initialize Facebook social plugins on the page
      version    : 'v2.4' // point to the latest Facebook Graph API version
    });

        Parse.FacebookUtils.init()
  };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/all.js#version=v2.4&appId=149084035430560&status=true&cookie=true&xfbml=true";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

angular.module('starter', ['ionic'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("mainController", function($scope) {
    var Category = Parse.Object.extend("Category");
    var query = new Parse.Query(Category);
    $scope.profilePicture = "";
    $scope.cardActive = false;
    $scope.categories = [];
    $scope.login = function(){
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            $scope.cardActive = true;
            console.log(user)
            $scope.$apply(
                function(){
                    $scope.profilePicture = 'https://graph.facebook.com/' + user.attributes.authData.facebook.id +'/picture?type=large';
                }
            )
          },
          error: function(user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
          }
        });
    }

    query.find({
        success: function(result){
            console.log(result)
            $scope.$apply(
                function(){
                    for (var i = 0; i < result.length; i++) {
                        $scope.categories.push({
                            label:result[i].attributes.label,
                            activities: []
                        })
                        for (var j = 0; j < 5; j++) {
                            $scope.categories[i].activities.push(j);
                        };
                    };
                })
        },
        error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
        }
    })

    $scope.toggleGroup = function(cat) {
        if ($scope.isGroupShown(cat)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = cat;
        }
    };
    $scope.isGroupShown = function(cat) {
        return $scope.shownGroup === cat;
    };


    $scope.save = function(){
        var category = new Category();
        category.set("label", "Academia");
        category.save(null, {
            success: function(result) {
            // Execute any logic that should take place after the object is saved.
                alert('New object created with objectId: ' + result.id);
            },
            error: function(result, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
                alert('Failed to create new object, with error code: ' + error.message);
           }
        });
    }
});
