'use strict';
angular.module('app.services', [])

  .factory('BlankFactory', [function () {

  }])

  .factory('LocalStorageFactory', ['$window', function LocalStorageFactory($window) {
    const store = $window.localStorage;

    return {
      setItem,
      getItem,
      removeItem
    };

    function setItem(key, value) {
      return store.setItem(key, value);
    }

    function getItem(key) {
      return store.getItem(key);
    }

    function removeItem(key) {
      return store.removeItem(key);
    }
  }])

  .factory('AuthTokenFactory', ['LocalStorageFactory', function AuthTokenFactory(LocalStorageFactory) {
    const key = 'token';

    return {
      getToken,
      setToken,
      deleteToken
    };

    function getToken() {
      return LocalStorageFactory.getItem(key);
    }

    function setToken(token) {
      return LocalStorageFactory.setItem(key, token);
    }

    function deleteToken() {
      return LocalStorageFactory.removeItem(key);
    }
  }])

  .factory('AuthInterceptor', ['AuthTokenFactory', function AuthInterceptor(AuthTokenFactory) {
    return {
      request: addToken
    };

    function addToken(config) {
      var token = AuthTokenFactory.getToken();
      console.log('token state:', token);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = token;
      }
      return config;
    }
  }])

  .service('BlankService', [function () {

  }])

  .service('userService', ['$q', '$http', 'AuthTokenFactory', 'LocalStorageFactory', function userService($q, $http, AuthTokenFactory, LocalStorageFactory) {
    const service = this;

    service.makeNew = makeNew;
    service.login = login;
    service.logout = logout;
    console.log('initializing user Service NOW');
    service.userData = {};

    function makeNew(email, username, password) {
      return $http.post("http://eggnogg:8000/users/", {
          email,
          username,
          password
        })
        .then(function success(response) {
          service.userData = response.data;
          LocalStorageFactory.setItem('userId', response.data.id);
          LocalStorageFactory.setItem('username', response.data.username);
          return response.data;
        }, function error(error) {
          return $q.reject(error);
        });
    }

    function login(email, password) {
      return $http.post('http://eggnogg:8000/token/', {
          email,
          password
        })
        .then(function success(response) {
          const token = response.data.token;
          AuthTokenFactory.setToken(token);
          delete response.data.token;
          console.log('token:', token);
          service.loggedIn = true;
          console.log('logged in?', service.loggedIn);
          service.userData = response.data;
          LocalStorageFactory.setItem('userId', response.data.id);
          LocalStorageFactory.setItem('username', response.data.username);
          return response;
        }, function failure(error) {
          return $q.reject(error);
        });
    }

    function logout() {
      service.loggedIn = false;
      return AuthTokenFactory.deleteToken();
    }
  }])

  .service('tokenService', ['AuthTokenFactory', '$http', 'userService', function tokenService(AuthTokenFactory, $http, userService) {

    const service = this;

    service.checkToken = checkToken;

    function checkToken() {
      const currentToken = AuthTokenFactory.getToken();
      if (currentToken) {
        $http.get('eggnogg:8000/token')
          .then((tokenValid) => {
            if (tokenValid === true) {
              console.log('token valid! keeping it.');
              userService.loggedIn = true;
              return true;
            } else {
              console.log('token invalid! removing it.');
              userService.logout();
              return false;
            }
          }, (error) => {
            console.log('tokenCheck error:', error);
            return false;
          });
      }
    }

  }])

  .service('networkService', ['$http', function ($http) {

    const service = this;

    service.testNetwork = testNetwork;

    function testNetwork() {
      return $http.get("http://eggnogg:8000/")
        .then(() => {
          console.log('NETWORK SUCCESS!');
          return true;
        }, () => {
          console.log('NETWORK ERROR!');
          return false;
        });
    }
  }])

  .service('filesService', ['$http', function ($http) {

    // once getFiles has been called, access the files object via filesService.files //

    const service = this;

    service.getFiles = getFiles;
    service.parseIcons = parseIcons;

    function getFiles() {
      return $http.get("http://eggnogg:8000/uploads/")
        .success(function (uploads) {
          service.files = parseIcons(uploads);
          console.log('files:', service.files);
          return service.files;
        })
        .error(function (data) {
          alert(`error: ${data}`);
        });
    }

    function parseIcons(files) {
      let type, filename, post;
      for (let key in files) {
        post = files[key];
        filename = post.file_name;
        type = filename.substring(filename.length - 4).toLowerCase();
        switch (type) {
        case ('.mp3'):
        case ('.ogg'):
        case ('.wav'):
        case ('.aac'):
        case ('.wma'):
          {
            post.icon = "ion-music-note";
            break;
          }
        case ('.mov'):
        case ('.wmv'):
        case ('.mp4'):
        case ('.avi'):
          {
            post.icon = "ion-ios-film-outline";
            break;
          }
        case ('.jpg'):
        case ('jpeg'):
        case ('.gif'):
        case ('.png'):
        case ('.psd'):
        case ('.tif'):
        case ('.bmp'):
          {
            post.icon = "ion-image";
            break;
          }
        case ('.txt'):
        case ('.doc'):
        case ('docx'):
        case ('.htm'):
        case ('html'):
        case ('.pdf'):
        case ('.rtf'):
        case ('.xls'):
        case ('xlsx'):
        case ('.ttf'):
          {
            post.icon = "ion-document";
            break;
          }
        default:
          {
            post.icon = "ion-nuclear";
            break;
          }
        }
      }
      return files;
    }
  }]);
