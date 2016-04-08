/**
 * Created by tushar on 18/3/16.
 */
angular.module("newApp").factory('ZoloFeatured',function($resource,serverConfig){
    return $resource(serverConfig.address+'api/featured',{feature_id:"@feature_id"},
        {
            addPackageToFeature:{
                url:serverConfig.address+'api/packageAddToFeature',
                method:"put"
            },
            removePackageFromFeature:{
                url:serverConfig.address+'api/packageRemoveFromFeature',
                method:"put"
            },
            getFeaturedPackages:{
                url:serverConfig.address+'api/getFeaturePackage/:feature_id',
                method:"get"
            }
        });
});
