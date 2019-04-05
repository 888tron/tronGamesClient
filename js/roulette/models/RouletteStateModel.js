!function() {
    class RouletteStateModel {

        /**
         * Event
         * @return {String}
         */
        static get CHANGE_EVENT() {
            return 'CHANGE_EVENT';
        }

        /**
         * @return {String}
         */
        static get PRE_LOADING() {
            return 'PRE_LOADING';
        }

        /**
         * @return {String}
         */
        static get GAME() {
            return 'GAME';
        }

        /**
         * @return {String}
         */
        static get WAITING_RESPONSE() {
            return 'WAITING_RESPONSE';
        }

        /**
         * @return {String}
         */
        static get SHOW_RESULT() {
            return 'SHOW_RESULT';
        }

        constructor() {
            this._state = RouletteStateModel.PRE_LOADING;
        }

        /**
         * @param value {String}
         */
        set state(value) {
            if (this._state === value) return;
            this._state = value;
            $(this).trigger(RouletteStateModel.CHANGE_EVENT);
        }

        /**
         * @return {String}
         */
        get state() {
            return this._state;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteStateModel = RouletteStateModel;
}();