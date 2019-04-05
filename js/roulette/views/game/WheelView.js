!function() {
    let RouletteStateModel = window.classes.RouletteStateModel;

    class WheelView {

        /**
         * Event
         * @return {String}
         */
        static get ANIMATION_COMPLETE_EVENT() {
            return 'ANIMATION_COMPLETE_EVENT';
        }

        /**
         * @param stateModel {window.classes.RouletteStateModel}
         * @param imagesModel {window.classes.ImagesModel}
         * @param resultModel {window.classes.ResultModel}
         * @param canvas {CanvasView}
         */
        constructor(stateModel, imagesModel, resultModel, canvas) {
            this._stateModel = stateModel;
            this._imagesModel = imagesModel;
            this._resultModel = resultModel;
            this._canvas = canvas;
            this._alpha = 1;
            this._numbersAngle = 0;
            this._ballAngle = 0;
            this._ballRadius = 175;
            this._resultAlpha = 0;
            $(this._stateModel).on(RouletteStateModel.CHANGE_EVENT, this._onStateModelChange.bind(this));
        }

        // TODO refactoring this shit
        _onStateModelChange() {
            if (this._stateModel.state === RouletteStateModel.WAITING_RESPONSE) {
                this._numbersAngle = 0;
                this._ballAngle = 0;
                this._ballRadius = 175;
                this._alpha = 0;
                this._resultAlpha = 0;
                new TWEEN.Tween(this)
                    .to({_alpha: 1}, 300)
                    .start();
                new TWEEN.Tween(this)
                    .to({_numbersAngle: 360}, 4000)
                    .repeat(Infinity)
                    .start();
                this._ballSpinTween = new TWEEN.Tween(this)
                    .to({_ballAngle: -360}, 1200)
                    .repeat(Infinity)
                    .start();
            }
            if (this._stateModel.state === RouletteStateModel.SHOW_RESULT) {
                new TWEEN.Tween(this)
                    .to({_ballRadius: 100}, 600)
                    .start()
                    .onComplete(() => {
                        if (this._ballSpinTween) TWEEN.remove(this._ballSpinTween);
                        let ballAngle = this._ballAngle;
                        this._ballSpinTween = new TWEEN.Tween(this)
                            .to({_ballAngle: ballAngle + 360}, 4000)
                            .repeat(Infinity)
                            .start();
                    });
                let circleTween = new TWEEN.Tween(this)
                    .to({_resultAlpha: 1}, 300)
                    .delay(1500).onUpdate(function(object) {
                        console.log(object._resultAlpha);
                    });
                circleTween.start();

                new TWEEN.Tween(this)
                    .to({_alpha: 0, _resultAlpha: 0}, 300)
                    .delay(3500)
                    .onComplete(() => {
                        $(this).trigger(WheelView.ANIMATION_COMPLETE_EVENT);
                    })
                    .start();
            }
        }

        update() {
            this._updateVail();
            this._updateWheelStatic();
            this._updateWheelNumbers();
            this._updateWheelBall();
            this._updateWheelLightMap();
            this._updateResult();
        }

        _updateVail() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this._canvas.context.fillRect(0, 0, this._canvas.canvas.width, this._canvas.canvas.height);
            this._canvas.context.restore();
        }

        _updateWheelStatic() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelStatic.png'), (this._canvas.canvas.width - 480) / 2, 0, 480, 480);
            this._canvas.context.restore();
        }

        _updateWheelNumbers() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.translate(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2);
            this._canvas.context.rotate(this._numbersAngle * Math.PI / 180);
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelNumbers.png'), -240, -240, 480, 480);
            this._canvas.context.restore();
        }

        _updateWheelBall() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.translate(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2);
            this._canvas.context.rotate(this._ballAngle * Math.PI / 180);
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelBall.png'), -15, -this._ballRadius - 15, 30, 30);
            this._canvas.context.restore();
        }

        _updateWheelLightMap() {
            if (this._stateModel.state !== RouletteStateModel.WAITING_RESPONSE &&
                this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheelLightMap.png'), (this._canvas.canvas.width - 480) / 2, 0, 480, 480);
            this._canvas.context.restore();
        }

        _updateResult() {
            if (this._stateModel.state !== RouletteStateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._resultAlpha;
            this._canvas.context.fillStyle = this._resultModel.win ? 'rgba(0, 170, 0, 0.9)' : 'rgba(170, 0, 0, 0.9)';
            this._canvas.context.beginPath();
            this._canvas.context.arc(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2, 88, 0, 2 * Math.PI);
            this._canvas.context.fill();

            this._canvas.context.font = '100px bold Helvetica';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.fillText(this._resultModel.number, this._canvas.canvas.width / 2, this._canvas.canvas.height / 2 + 30);

            let text = this._resultModel.win ? 'WIN' : 'NO WIN';
            this._canvas.context.font = '18px bold Helvetica';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, this._canvas.canvas.height / 2 + 70);

            this._canvas.context.restore();
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.WheelView = WheelView;
}();