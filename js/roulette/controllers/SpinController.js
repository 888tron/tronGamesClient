!function() {
    let RouletteStateModel = window.classes.RouletteStateModel;
    let RouletteSpinButtonNavigationView = window.classes.RouletteSpinButtonNavigationView;
    let WheelView = window.classes.WheelView;

    class SpinController {

        /**
         * @param stateModel {window.classes.RouletteStateModel}
         * @param resultModel {window.classes.ResultModel}
         * @param buttonView {window.classes.RouletteSpinButtonNavigationView}
         * @param wheelView {window.classes.WheelView}
         */
        constructor(stateModel, resultModel, buttonView, wheelView) {
            this._stateModel = stateModel;
            this._resultModel = resultModel;
            this._buttonView = buttonView;
            this._wheelView = wheelView;
            $(this._buttonView).on(RouletteSpinButtonNavigationView.CLICK_EVENT, this._onViewClick.bind(this));
            $(this._wheelView).on(WheelView.ANIMATION_COMPLETE_EVENT, this._onWheelAnimationComplete.bind(this));
        }

        _onViewClick() {
            this._stateModel.state = RouletteStateModel.WAITING_RESPONSE;
            this._fakeLoading();
        }

        /**
         * FAKE FOR TEST
         * @private
         */
        _fakeLoading() {
            setTimeout(() => { this._completeFakeLoading()}, 1500 + Math.random() * 2000)
        }

        /**
         * FAKE FOR TEST
         * @private
         */
        _completeFakeLoading() {
            let number = Math.floor(Math.random() * 37);
            let win = Boolean(Math.round(Math.random()));
            this._resultModel.update(number, win);
            this._stateModel.state = RouletteStateModel.SHOW_RESULT;
        }

        _onWheelAnimationComplete() {
            this._stateModel.state = RouletteStateModel.GAME;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.SpinController = SpinController;
}();