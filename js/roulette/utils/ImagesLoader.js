!function() {
    class ImagesLoader {

        /**
         * Event
         * @return {String}
         * @constructor
         */
        static get COMPLETE_EVENT() {
            return 'COMPLETE_EVENT';
        }

        /**
         * @param urls {String[]} Example:
         *     [
         *         'img/roulette/background.svg',
         *         'img/roulette/wheelStatic.svg',
         *         'img/roulette/wheelBall.svg'
         *     ]
         */
        constructor(urls) {
            this._urlsLength = urls.length;
            this._urls = urls;
            this._images = {};
            this._loadedImagesCount = 0;
        }

        load() {
            for (let i = 0; i < this._urlsLength; i++) {
                let url = this._urls[i];
                this._loadImage(url);
            }
        }

        /**
         * @param url {String} Example:
         *     'img/roulette/background.svg',
         * @private
         */
        _loadImage(url) {
            let image = new Image();
            image.onload = this._onImageLoaded.bind(this);
            image.onerror = this._imageError.bind(this);
            image.src = url;
            this._images[url] = image;
        }

        /**
         * @param url {String} Example:
         *     'img/roulette/background.svg',
         * @return {Image}
         */
        getImage(url) {
            return this._images[url];
        }

        /**
         * @private
         */
        _onImageLoaded() {
            this._loadedImagesCount++;
            if (this._loadedImagesCount !== this._urlsLength) return;
            $(this).trigger(ImagesLoader.COMPLETE_EVENT);
        }

        /**
         * @param event {Object}
         * @param event.target {Image}
         * @private
         */
        _imageError(event) {
            let image = event.target;
            let url = image.src;
            this._loadImage(url);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ImagesLoader = ImagesLoader;
}();