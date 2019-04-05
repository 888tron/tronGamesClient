!function() {
    class ImagesModel {
        /**
         * @param imagesLoader {ImagesLoader} Example:
         */
        setLoader(imagesLoader) {
            this._imagesLoader = imagesLoader;
        }

        /**
         * @param url {String} Example:
         *     'img/roulette/background.svg',
         * @return {Image}
         */
        getImage(url) {
            return this._imagesLoader.getImage(url);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ImagesModel = ImagesModel;
}();