!function()
{
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;

    class ChipsNavigationButtonsView
    {
        /**
         * Event.
         * @return String
         */
        static get CLICK_NEXT_EVENT()
        {
            return 'CLICK_NEXT_EVENT';
        }

        /**
         * Event.
         * @return String
         */
        static get CLICK_PREVIOUS_EVENT()
        {
            return 'CLICK_PREVIOUS_EVENT';
        }

        /**
         * @param model {ChipsNavigationModel}
         * @param previousButton {String}
         * @param nextButton {String}
         */
        constructor(model, previousButton, nextButton)
        {
            this._model = model;
            this._previousButton = previousButton;
            this._nextButton = nextButton;

            $(this._model).on(ChipsNavigationModel.CHANGE_EVENT, this._updateButtons.bind(this));
            $(this._previousButton).click(this._onPreviousButtonClick.bind(this));
            $(this._nextButton).click(this._onNextButtonClick.bind(this));
            this._updateButtons();
        }

        _onPreviousButtonClick()
        {
            $(this).trigger(ChipsNavigationButtonsView.CLICK_PREVIOUS_EVENT);
        }

        _onNextButtonClick()
        {
            $(this).trigger(ChipsNavigationButtonsView.CLICK_NEXT_EVENT);
        }

        _updateButtons()
        {
            if (this._model.index === 0) $(this._previousButton).attr('disabled', 'disabled');
            else $(this._previousButton).removeAttr('disabled', 'disabled');

            if (this._model.index === this._model.length - 1) $(this._nextButton).attr('disabled', 'disabled');
            else $(this._nextButton).removeAttr('disabled', 'disabled');
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ChipsNavigationButtonsView = ChipsNavigationButtonsView;
}();