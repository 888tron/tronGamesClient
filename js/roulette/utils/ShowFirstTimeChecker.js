!function() {
    class ShowFirstTimeChecker {

        /**
         * Event
         * @return {String}
         * @constructor
         */
        static get SHOW_FIRST_TIME_EVENT() {
            return 'SHOW_FIRST_TIME_EVENT';
        }

        /**
         * @param element {String}
         */
        constructor(element) {
            this._element = element;
        }

        check() {
            requestAnimationFrame(this._checkVisible.bind(this));
        }

        _checkVisible() {
            let visible = this._isVisible();
            if (visible) {
                $(this).trigger(ShowFirstTimeChecker.SHOW_FIRST_TIME_EVENT);
            }
            else {
                requestAnimationFrame(this._checkVisible.bind(this));
            }
        }

        _isVisible() {
            return $(this._element).is(':visible');
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ShowFirstTimeChecker = ShowFirstTimeChecker;
}();