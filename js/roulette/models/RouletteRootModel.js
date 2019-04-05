!function() {
    let RouletteStateModel = window.classes.RouletteStateModel;
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;
    let ResultModel = window.classes.ResultModel;
    let ImagesModel = window.classes.ImagesModel;

    class RouletteRootModel {

        /**
         *
         * @param chips {Number[]} Example:
         *     [
         *         10,
         *         20
         *     ]
         */
        constructor(chips) {
            this._chipsNavigation = new ChipsNavigationModel(chips);
            this._images = new ImagesModel();
            this._state = new RouletteStateModel();
            this._result = new ResultModel();
        }

        /**
         * @return {ChipsNavigationModel}
         */
        get chipsNavigation() {
            return this._chipsNavigation;
        }

        /**
         * @return {ImagesModel}
         */
        get images() {
            return this._images;
        }

        /**
         * @return {RouletteStateModel}
         */
        get state() {
            return this._state;
        }

        /**
         * @return {ResultModel}
         */
        get result() {
            return this._result;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteRootModel = RouletteRootModel;
}();