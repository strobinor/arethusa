"use strict";

angular.module('arethusa.core').factory('translator', [
  '$rootScope',
  '$translate',
  '$interpolate',
  function($rootScope, $translate, $interpolate) {
    function translate(id, objOrFn, propertyPath) {
      $translate(id, null, 'nullInterpolator').then(function(translation) {
        if (angular.isFunction(objOrFn)) {
          objOrFn(translation);
        } else {
          arethusaUtil.setProperty(
            objOrFn,
            propertyPath,
            $interpolate(translation)
          );
        }
      });
    }

    function registerAndTranslate(id, objOrFn, propertyPath) {
      // needs to run when intialized
      translate(id, objOrFn, propertyPath);

      $rootScope.$on('$translateChangeSuccess', function() {
        translate(id, objOrFn, propertyPath);
      });
    }
    return function(idOrObj, objOrFn, propertyPath) {
      if (angular.isObject(idOrObj)) {
        if (angular.isArray(idOrObj)) {
          angular.forEach(idOrObj, function(idAndPath) {
            registerAndTranslate(idAndPath, objOrFn, idAndPath);
          });
        } else {
          angular.forEach(idOrObj, function(path, id) {
            registerAndTranslate(id, objOrFn, path);
          });
        }
      } else {
        registerAndTranslate(idOrObj, objOrFn, propertyPath);
      }
    };
  }
]);
