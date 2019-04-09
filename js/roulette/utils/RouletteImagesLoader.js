!function() {
    let ImagesLoader = window.classes.ImagesLoader;

    class RouletteImagesLoader extends ImagesLoader {

        /**
         * @return {String[]}
         * @constructor
         */
        static get IMAGES() {
            return [
                'img/roulette/wheelBall.png',
                'img/roulette/wheelLightMap.png',
                'img/roulette/wheelNumbers.png',
                'img/roulette/wheelStatic.png',
                'img/roulette/wheelResultLightMap.png',
            ]
        }

        constructor() {
            super(RouletteImagesLoader.IMAGES);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteImagesLoader = RouletteImagesLoader;
}();