!function() {
    let RouletteStateModel = window.classes.RouletteStateModel;

    class RouletteSpinButtonNavigationView {

        /**
         * Event
         * @return {String}
         * @constructor
         */
        static get CLICK_EVENT() {
            return 'CLICK_EVENT';
        }

        /**
         * @param stateModel {RouletteStateModel} Example:
         * @param element {String} Example:
         *     '#spinRouletteButton',
         */
        constructor(stateModel, element) {
            this._stateModel = stateModel;
            this._button = $(element);
            $(this._stateModel).on(RouletteStateModel.CHANGE_EVENT, this._onRouletteStateChange.bind(this));
            $(this._button).click(this._onButtonClick.bind(this));
            this._onRouletteStateChange();
        }

        _onButtonClick() {
            if (this._stateModel.state !== RouletteStateModel.GAME) return;
            $(this).trigger(RouletteSpinButtonNavigationView.CLICK_EVENT);
        }

        _onRouletteStateChange() {
            if (this._stateModel.state === RouletteStateModel.GAME) {
                $(this._button).removeAttr('disabled');
            }
            else {
                $(this._button).attr('disabled', 'disabled');
            }
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteSpinButtonNavigationView = RouletteSpinButtonNavigationView;
}();