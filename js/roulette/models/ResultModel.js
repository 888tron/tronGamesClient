!function() {
    class ResultModel {

        /**
         * Event
         * @return {String}
         */
        static get CHANGE_EVENT() {
            return 'CHANGE_EVENT';
        }

        constructor() {
            this._number = 0;
            this._win = false;
        }

        /**
         * @param number {Number}
         * @param win {Boolean}
         */
        update(number, win) {
            this._number = number;
            this._win = win;
            $(this).trigger(ResultModel.CHANGE_EVENT);
        }

        /**
         * @return {Number}
         */
        get number() {
            return this._number;
        }

        /**
         * @return {Number}
         */
        get win() {
            return this._win;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ResultModel = ResultModel;
}();