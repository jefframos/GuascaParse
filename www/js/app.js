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
    // Parse.FacebookUtils.init()
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js#version=v2.4&appId=149084035430560&status=true&cookie=true&xfbml=true";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

angular.module('starter', ['ionic'])

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})
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

.controller("mainController", function($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function(save) {
        $scope.modal.hide();
        if(!save){
            return
        }
        var userActivity = new UserActivity();
        userActivity.set("userId", Parse.User.current());
        userActivity.set("activityId", $scope.currentActivity);
        userActivity.save(null, {
            success: function(result) {
                console.log(result)
            },
            error: function(result, error) {
                console.log(result, error)
           }
        });
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });


    $scope.profilePicture = "";
    $scope.cardActive = false;
    $scope.categories = [];
    $scope.dailyActivities = [];


    var Category = Parse.Object.extend("Category");
    var Activity = Parse.Object.extend("Activity");
    var UserActivity = Parse.Object.extend("UserActivity");
    var getCategories = new Parse.Query(Category);
    var getActivities = new Parse.Query(Activity);
    var getUserActivity = new Parse.Query(UserActivity);
    getUserActivity.include("userId");
    console.log(Parse)
    getCategories.find({
        success: function(result){
            console.log(result)
            $scope.$apply(
                function(){
                    for (var i = 0; i < result.length; i++) {
                        $scope.categories.push({
                            id:result[i].id,
                            label:result[i].attributes.label,
                            color:result[i].attributes.color,
                            activities: []
                        })
                    };
                })

            getActivities.find({
                success: function(result){
                    var mObj = {};
                    for (var i = 0; i < result.length; i++) {
                        for (var j = $scope.categories.length - 1; j >= 0; j--) {
                            if($scope.categories[j].id == result[i].attributes.categoryId.id){
                                $scope.categories[j].activities.push(result[i]);
                            }
                        }
                    }
                }
            });
            getUserActivity.find({
                success: function(result){
                    var mObj = {};
                    var tempToday = new Date();
                    var tempDate = null;
                    for (var i = 0; i < result.length; i++) {
                        if(result[i].attributes.userId.id == Parse.User.current().id)
                        {
                            console.log('the same user')
                            tempDate = new Date(result[i].createdAt);
                            if(tempDate.getUTCDate() == tempDate.getUTCDate() &&
                                tempDate.getMonth() == tempDate.getMonth()){
                                $scope.dailyActivities.push(result[i].attributes.activityId)
                                console.log(result[i].attributes.activityId)
                            }
                        }
                    }
                }
            });
        },
        error: function(object, error) {
            Parse.User.logOut();
            console.log(object, error);
        }
    })
    // Parse.User.logOut();

    setUser = function(user){
        $scope.cardActive = true;
        $scope.$apply(
            function(){
                $scope.profilePicture = 'https://graph.facebook.com/' + user.attributes.authData.facebook.id +'/picture?type=large';
            }
        )
    }
    $scope.verifyActivity = function(activity){
        for (var i = $scope.dailyActivities.length - 1; i >= 0; i--) {
                console.log($scope.dailyActivities[i] == activity)
            if($scope.dailyActivities[i] == activity.id){
                return true
            }
        };
        return false;
    }
    $scope.doActivity = function(activity){
        console.log(activity);
        $scope.currentActivity = activity;
        $scope.openModal();

    }
    $scope.login = function(){
        if(Parse.User.current()){
            setUser(Parse.User.current());
        }
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
                setUser(user)
          },
          error: function(user, error) {
            console.log(user)
            if(user){
                setUser(user)
            }
          }
        });
    }
    var currentUser = Parse.User.current();
    setTimeout(function(){
        if (Parse.User.current()) {
        $scope.login();
            // do stuff with the user
        } else {
            // show the signup or login page
        }
    }, 1000)

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


    $scope.saveUser = function(){
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
