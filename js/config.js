var API_BASE_URL = 'http://rci.content-core.com/v1';
var API_BASE_V2_URL = 'http://rci.content-core.com/v2';
var API_BASE_V3_URL = 'http://rci.content-core.com/v3';
//var API_BASE_URL = 'http://localhost:8081';

angular.module('defaultLibrary').constant('CONFIG', {
    //GET_ALL_REGIONS_URL: '{{API_BASE_URL}}/region/'.replace('{{API_BASE_URL}}',API_BASE_URL),
    //GET_REGION_URL: '{{API_BASE_URL}}/resort/?location={{location}}&digest=true'.replace('{{API_BASE_URL}}',API_BASE_URL),
    //GET_RESORT_URL: '{{API_BASE_URL}}/resort/{{resortId}}'.replace('{{API_BASE_URL}}',API_BASE_URL),
    GET_RESORTS_URL: '{{API_BASE_URL}}/resort/?location={{location}}&digest=true&limit=1000'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    GET_ATTRACTIONS_URL: '{{API_BASE_URL}}/attraction/?lat={{lat}}&lng={{lng}}&source={{source}}&offset={{offset}}&limit={{limit}}'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    GET_EVENTS_URL: '{{API_BASE_URL}}/event/?lat={{lat}}&lng={{lng}}&offset={{offset}}&limit={{limit}}&radius={{radius}}'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    GET_MEDIA_URL: '{{API_BASE_URL}}/media/?location={{location}}&types=article,video'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    GET_TIME_URL: '{{API_BASE_URL}}/time/?lat={{lat}}&lng={{lng}}'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    GET_TRANSLATIONS_URL: '{{API_BASE_URL}}/translation/{{languageCodes}}'.replace('{{API_BASE_URL}}',API_BASE_URL),
    GET_MP3_URL: '{{API_BASE_URL}}/mp3/?url={{url}}'.replace('{{API_BASE_URL}}',API_BASE_URL),
    GET_WEATHER_URL: '{{API_BASE_URL}}/weather/?lat={{lat}}&lng={{lng}}'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    RESORT_IMAGE_URL: 'http://rci-static.stryplt.com/images/resorts/',
    ONLINE_TEST_URL: 'http://www.yahoo.com',

    V2_ACCESS_TOKEN: 'access_token=oYETctGHtRhHANIn8ukDS1WIutGWk8Sj3VqI00GNx8g8KFWHfdmzrIPUp06DEuvh',
    V3_ACCESS_TOKEN: 'access_token=12lvoYxVdpOcMYbZb8MEKhNRNXAV6nDwjiOnE5Kmdpuu7pecn0aIMyAtltoOCGtR',

    //GET_ALL_REGIONS_V2_URL: '{{API_BASE_URL}}/locationtaxonomyterm?filter=%7B%22where%22%3A%7B%22taxonomyId%22%3A2%7D%7D'.replace('{{API_BASE_URL}}',API_BASE_V2_URL),
    GET_ALL_REGIONS_V3_URL: '{{API_BASE_URL}}/locationtaxonomyterm?filter=%7B%22where%22%3A%7B%22taxonomyId%22%3A2%7D%7D'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    //GET_LOCATION_ID_V2_URL: '{{API_BASE_URL}}/locationtaxonomyterm/{{regionID}}?filter=%7B%22include%22%3A%22locations%22%7D'.replace('{{API_BASE_URL}}',API_BASE_V2_URL),
    GET_LOCATION_ID_V3_URL: '{{API_BASE_URL}}/locationtaxonomyterm/{{regionID}}?filter=%7B%22include%22%3A%22locations%22%7D'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    //GET_RESORT_LIST_V2_URL: '{{API_BASE_URL}}/resort?filter=%7B%22where%22%3A%7B%22locationId%22%3A%20%7B%22inq%22%3A%5B{{locationID}}%5D%7D%20%7D%7D'.replace('{{API_BASE_URL}}',API_BASE_V2_URL),
    GET_RESORT_LIST_V3_URL: '{{API_BASE_URL}}/resort?filter=%7B%22where%22%3A%7B%22locationId%22%3A%20%7B%22inq%22%3A%5B{{locationID}}%5D%7D%20%7D%7D'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    //GET_RESORT_V2_URL: '{{API_BASE_URL}}/resort/{{resortID}}'.replace('{{API_BASE_URL}}',API_BASE_V2_URL),
    GET_RESORT_V3_URL: '{{API_BASE_URL}}/resort/{{resortID}}'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),
    //RESORT_IMAGE_V2_URL: '{{API_BASE_URL}}/resort/'.replace('{{API_BASE_URL}}',API_BASE_V2_URL),
    RESORT_IMAGE_V3_URL: '{{API_BASE_URL}}/resort/'.replace('{{API_BASE_URL}}',API_BASE_V3_URL),

    RESORT_TAB_OVERVIEW: 'overview',
    RESORT_TAB_ROOM_DETAIL: 'room-details',
    RESORT_TAB_RESORT_DETAIL: 'resort-details',
    RESORT_TAB_AMENITIES: 'amenities',
    RESORT_TAB_AREA_INFO: 'area-info',
    RESORT_TAB_AREA_EVENTS: 'area-events',

    PAGE_HOME: 'home.html',
    PAGE_REGION_IMAGE: 'region-image.html',
    PAGE_REGION: 'region.html',
    PAGE_RESORT: 'resort.html',
    PAGE_ARTICLE: 'article.html',
    PAGE_COVER: 'cover.html',
    PAGE_WELCOME: 'welcome.html',
    PAGE_USER_GUIDE: 'user-guide.html',
    PAGE_MEMBERSHIP: 'membership.html',
    PAGE_LEGAL: 'legal.html',
    PAGE_PHRASES: 'essential-phrases.html',
    ONLINE_OVERRIDE: undefined,
    /*  http://boundingbox.klokantech.com/  */
    /*  [w,s,e,n]  */
    REGIONS: {
        'usa': [
            {id: '585', color: '#2D3192', align: 'left', mapTop: '54px', bounds: [-73.73,40.95,-66.89,47.46]},
            {id: '592', color: '#0054A5', align: 'left', mapTop: '37px', bounds: [-80.6437,37.0209,-71.6927,42.0853]},
            {id: '599', color: '#017F3F', align: 'right', mapTop: '39px', bounds: [-84.3845,32.1432,-75.3995,40.7368]},
            {id: '605', color: '#FEC70A', align: 'right', mapTop: '95px', bounds: [-87.6349,24.3963,-79.9743,31.001]},
            {id: '609', color: '#C07617', align: 'left', mapTop: '51px', bounds:[-104.32,36.31,-80.3,49.5]},
            {id: '618', color: '#ED1848', align: 'left', mapTop: '107px', bounds:[-103.22,32.81,-81.71,40.79]},
            {id: '624', color: '#8CC63E', align: 'left', mapTop: '93px', bounds: [-103.18,28.76,-81.67,40.71]},
            {id: '629', color: '#CA422C', align: 'left', mapTop: '45px', bounds: [-117.24,31.1,-101.75,49.16]},
            {id: '637', color: '#0072BB', align: 'left', mapTop: '35px', bounds: [-124.41,32.53,-113.91,49.13]},
            {id: '645', color: '#FDAF17', align: 'left', mapTop: '105px', bounds: [-178.31,18.91,-154.81,28.4]}
        ],
        'america': [
            {id: '650', color: '#0CB14B', align: 'right', mapTop: '101px', bounds: [-141.0,41.7,-52.6,66.5]},
            {id: '657', color: '#EF0E6A', align: 'left', mapTop: '85px', bounds: [-118.36,14.53,-86.71,32.72], languages:['es']},
            {id: '667', color: '#F15A21', align: 'left', mapTop: '51px', bounds: [-85.17,9.99,-58.85,33.07], languages:['es']}
        ],
        'international': [
            {id: '691', color: '#009B90', align: 'right', mapTop: '35px', bounds: [-92.27,-55.89,-34.09,18.5], languages:['es','pt']},
            {id: '709', color: '#00ADEF', align: 'left', mapTop: '44px', bounds: [-28.0,33.9,74.1,82.7], languages:['de','el','fi','fr','ga','hr','it','lt','nl','pt']},
            {id: '739', color: '#A92C3E', align: 'left', mapTop: '57px', bounds: [-18.16,27.64,4.33,43.79], languages:['es','fr','pt']},
            {id: '744', color: '#F27120', align: 'left', mapTop: '35px', bounds: [-17.7,-35.5,63.3,42.4], languages:['ar','fr','he']},
            {id: '762', color: '#A3248F', align: 'left', mapTop: '47px', bounds: [67.52,-18.63,-179.7,53.56], languages:['fr','hi','id','zh']},
            {id: '777', color: '#A3550B', align: 'left', mapTop: '54px', bounds: [112.92,-54.78,178.94,-9.22]}
        ]
    },

    ANIMATION_LEFT_TO_RIGHT: {in: 'moveInLeft', out: 'moveOutRight' },
    ANIMATION_RIGHT_TO_LEFT: {in: 'moveInRight', out: 'moveOutLeft' },
    ANIMATION_UP_TO_DOWN: {in: 'moveInDown', out: 'moveOutDown' },
    ANIMATION_DOWN_TO_UP: {in: 'moveInUp', out: 'moveOutUp' },
    ANIMATION_PREFIX: 'animated',
    ANIMATION_ALL: ['animated', 'moveInRight', 'moveOutLeft', 'moveInLeft', 'moveOutRight', 'moveInUp', 'moveOutDown', 'moveInDown', 'moveOutUp' ]
});
