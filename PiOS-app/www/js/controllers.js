'use strict';

angular.module('app.controllers', ['ionic'])

  .controller('menuCtrl', ['$scope', '$stateParams', '$state', '$ionicSideMenuDelegate', 'userService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $state, $ionicSideMenuDelegate, userService) {
      const vm = this;

      vm.logout = logout;
      vm.login = login;
      vm.loginStatus = userService.loggedIn;

      function logout() {
        userService.logout();
        vm.loginStatus = false;
        $ionicSideMenuDelegate.toggleLeft(false);
        return $state.go('landing');
      }

      function login() {
        $ionicSideMenuDelegate.toggleLeft(false);
        // vm.loginStatus=true;
        return $state.go('login');
      }

    }
  ])

  .controller('homeCtrl', ['$scope', '$stateParams', 'filesService', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, filesService, $http) {
      const vm = this;
      vm.$onInit = onInit;
      vm.playback = playback;
      vm.returnPath = returnPath;

      function playback(post) {
        post.showMedia = true;
        vm.watchPost = "http://eggnogg:8000/uploads/" + post.file_name;
      }

      function returnPath(post) {
        vm.watchPost = "http://eggnogg:8000/uploads/" + post.file_name;
        return vm.watchPost;
      }

      function onInit() {
        filesService.getFiles()
          .then((res) => {
            vm.data = res.data;

            $http.get("http://eggnogg:8000/users")
              .success(function (userProfile) {
                vm.userdata = userProfile;
                for (var t = 0; t < vm.userdata.length; t++) {
                  for (var i = 0; i < vm.data.length; i++) {
                    if (vm.data[i].username === vm.userdata[t].username) {
                      vm.data[i].avatar_path = vm.userdata[t].avatar_path;
                      console.log("samsies in data? " + vm.data[i].avatar_path);
                      console.log("samsies in userdata? " + vm.userdata[t].avatar_path);
                    }
                  }
                }
              })
              .error(function (data) {
                alert(`error: ${data}`);
              });
          });
      }
    }
  ])
  .controller('searchCtrl', ['$scope', '$stateParams', 'filesService', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, filesService, $http) {
      const vm = this;
      vm.$onInit = onInit;
      vm.playback = playback;
      vm.returnPath = returnPath;

      function playback(post) {
        post.showMedia = true;
        vm.watchPost = "http://eggnogg:8000/uploads/" + post.file_name;
      }

      function returnPath(post) {
        vm.watchPost = "http://eggnogg:8000/uploads/" + post.file_name;
        return vm.watchPost;
      }

      function onInit() {
        if (filesService.files) {
          vm.data = filesService.files;
          console.log('search data found:', vm.data);

          $http.get("http://eggnogg:8000/users")
            .success(function (userProfile) {
              vm.userdata = userProfile;
              for (var t = 0; t < vm.userdata.length; t++) {
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].username === vm.userdata[t].username) {
                    vm.data[i].avatar_path = vm.userdata[t].avatar_path;
                    console.log("samsies in data? " + vm.data[i].avatar_path);
                    console.log("samsies in userdata? " + vm.userdata[t].avatar_path);
                  }
                }
              }
            })
            .error(function (data) {
              alert(`error: ${data}`);
            });
        } else {
          filesService.getFiles((files) => {
            vm.data = files;
            console.log('initialize search:', vm.data);

            $http.get("http://eggnogg:8000/users")
              .success(function (userProfile) {
                vm.userdata = userProfile;
                for (var t = 0; t < vm.userdata.length; t++) {
                  for (var i = 0; i < vm.data.length; i++) {
                    if (vm.data[i].username === vm.userdata[t].username) {
                      vm.data[i].avatar_path = vm.userdata[t].avatar_path;
                      console.log("samsies in data? " + vm.data[i].avatar_path);
                      console.log("samsies in userdata? " + vm.userdata[t].avatar_path);
                    }
                  }
                }
              })
              .error(function (data) {
                alert(`error: ${data}`);
              });
          });
        }
        // return filesService.files;
      }
    }
  ])

  .controller('profileCtrl', ['$scope', '$stateParams', '$http', 'filesService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http, filesService) {
      const vm = this;
      vm.profileFilter = localStorage.getItem("username");
      vm.$onInit = onInit;
      vm.playback = playback;
      vm.returnPath = returnPath;

      function playback(post) {
        post.showMedia = true;
        vm.watchPost = "http://eggnogg:8000/uploads/" + post.file_name;
      }

      function returnPath(post) {
        vm.watchPost = "http://eggnogg:8000/uploads/" + post.file_name;
        return vm.watchPost;
      }

      function onInit() {
        var userId = localStorage.getItem("userId");
        vm.uploadData = filesService.files;
        return $http.get(`http://eggnogg:8000/users/${userId}`)
          .success(function (userProfile) {
            vm.data = userProfile;
          })
          .error(function (data) {
            alert(`error: ${data}`);
          });
      }
    }
  ])

  .controller('loginCtrl', ['$scope', '$stateParams', '$http', '$state', 'userService', 'tokenService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http, $state, userService, tokenService) {
      const vm = this;
      vm.login = login;
      vm.$onInit = onInit;

      function onInit() {
        if (tokenService.checkToken()) {
          console.log('You are already logged in!');
          $state.go('tabsController.home');
        } else {
          userService.logout();
          console.log('You are not logged in!');
        }
      }

      function login() {

        if (!vm.loginForm.email) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an email",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else if (!vm.loginForm.password) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an password",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else {
          userService.login(vm.loginForm.email, vm.loginForm.password)
            .then((res) => {
              console.log('login successful:', res.data);
              console.log('userService:', userService.userData);
              vm.data = userService.userData;

              $state.go('tabsController.home');
            }, (error) => {
              console.log('login failed:', error.data);
              window.plugins.toast.showWithOptions({
                message: `Login failed: ${error.data}.\n Please try again.`,
                duration: "long",
                position: "center",
                addPixelsY: -40
              });
            });
        }

      }
    }
  ])

  .controller('landingCtrl', ['$scope', '$stateParams', '$ionicModal', '$http', '$timeout', 'networkService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName

    function ($scope, $stateParams, $ionicModal, $http, $timeout, networkService) {
      const vm = this;

      vm.$onInit = onInit;
      vm.toggleModal = toggleModal;
      vm.testNetwork = testNetwork;
      vm.buttonMessage = "Try Again";
      vm.wifiName = " PiOS Media Server";
      vm.showModal = true;

      function testNetwork() {
        return networkService.testNetwork()
          .then((online) => {
            if (online) {
              vm.showModal = false;
              vm.modal.hide().then(() => {
                vm.message = ["Thank you for connecting to ", ""];
                vm.buttonMessage = "Continue";
                vm.modal.show();
                $timeout(() => {
                  toggleModal();
                }, 1500);
              });
            } else {
              vm.message = ["Please ensure your phone is connected to ", " before continuing."];
              vm.showModal = true;
              vm.modal.hide().then(() => {
                toggleModal();
              });
            }
          });
      }

      function toggleModal() {
        if (vm.showModal) {
          return vm.modal.show();
        } else {
          return vm.modal.remove();
        }
      }

      function onInit() {
        $ionicModal.fromTemplateUrl('wifi-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          vm.modal = modal;
        });
        testNetwork();
      }
    }
  ])
  .controller('signupCtrl', ['$scope', '$stateParams', '$http', '$state', 'userService',
    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http, $state, userService) {

      const vm = this;
      vm.signup = signup;

      function signup() {

        if (!vm.signupForm.email) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an email",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else if (!vm.signupForm.username) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an username",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else if (!vm.signupForm.password) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an password",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else {
          vm.password = vm.signupForm.password;
          userService.makeNew(vm.signupForm.email, vm.signupForm.username, vm.signupForm.password)
            .then(function success(userData) {
              vm.data = userData;
              vm.data.password = vm.password;
              userService.login(vm.data.email, vm.data.password)
                .then((res) => {
                  vm.data = res;
                  $state.go('tabsController.profile');
                }, (error) => {
                  $state.go('tabsController.login');
                });
            }, function error(error) {
              window.plugins.toast.showWithOptions({
                message: `Failed to create user: ${error.data}.\nPlease try again.`,
                duration: "long",
                position: "center",
                addPixelsY: -40
              });
            });
        }
      }
    }
  ]);
