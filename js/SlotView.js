class SlotModel {
    constructor() {
        this.linesAll =
            [
                [5, 6, 7, 8, 9],
                [0, 1, 2, 3, 4],
                [10, 11, 12, 13, 14],

                [0, 6, 12, 8, 4],
                [10, 6, 2, 8, 14],

                [5, 11, 12, 13, 9],
                [5, 1, 2, 3, 9],

                [10, 11, 7, 3, 4],
                [0, 1, 7, 13, 14],

                [10, 6, 7, 8, 4]
            ];

        this.itemMult = [
            [10, 15, 24],
            [1, 1, 15],
            [4, 7, 10],
            [3, 4, 7],
            [2, 3, 5],
            [1, 2, 3]
        ];

        this.randomItems = [
            0,
            1, 1, 1,
            2, 2,
            3, 3, 3,
            4, 4, 4,
            5, 5, 5, 5
        ];

        this.itemsCount = this.itemMult.length;

        this.betLineCount = 10;
        this.betAmountSum = 0;
    }

    createRandomItem() {
        return this.randomItems[Math.floor(Math.floor(Math.random() * 16))];
    }

    createRandomItems(count) {
        return [...Array(count)].map(() => this.createRandomItem());
    }

    getLineMult(randomResult, lineIndex) {
        const line = this.linesAll[lineIndex];

        let item = randomResult[line[0]];

        let posItem = randomResult[line[1]];

        let mult0 = 0;
        let mult1 = 0;

        let winItems = [];

        if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
            if (item === 1) item = posItem;

            posItem = randomResult[line[2]];

            if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
                if (item === 1) item = posItem;

                posItem = randomResult[line[3]];

                if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
                    if (item === 1) item = posItem;

                    posItem = randomResult[line[4]];

                    if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
                        if (item === 1) item = posItem;

                        mult0 = this.itemMult[item][2];
                        winItems = [0, 1, 2, 3, 4];
                    } else {
                        mult0 = this.itemMult[item][1];
                        winItems = [0, 1, 2, 3];
                    }
                } else {
                    mult0 = this.itemMult[item][0];
                    winItems = [0, 1, 2];
                }
            }
        }

        item = randomResult[line[4]];

        posItem = randomResult[line[3]];

        if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
            if (item === 1) item = posItem;

            posItem = randomResult[line[2]];

            if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
                if (item === 1) item = posItem;

                posItem = randomResult[line[1]];

                if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
                    if (item === 1) item = posItem;

                    posItem = randomResult[line[0]];

                    if (posItem === item || (item > 1 && posItem === 1) || (posItem > 1 && item === 1)) {
                        if (item === 1) item = posItem;

                        mult1 = this.itemMult[item][2];
                        winItems = [0, 1, 2, 3, 4];
                    } else {
                        mult1 = this.itemMult[item][1];
                        winItems = [1, 2, 3, 4];
                    }
                } else {
                    mult1 = this.itemMult[item][0];
                    winItems = [2, 3, 4];
                }
            }
        }
        if (mult0 < mult1) mult0 = mult1;

        return {mult: mult0, winItems: winItems, lineIndex: lineIndex};
    };


    getWinData(randomResult) {
        let winMultSum = 0;
        let winLines = [];
        for (let lineIndex = 0; lineIndex < this.betLineCount; lineIndex++) {

            const winLine = this.getLineMult(randomResult, lineIndex);

            if (winLine.mult) {
                winLines.push(winLine);
            }

            winMultSum += winLine.mult;
        }
        return {winMultSum: winMultSum, winLines: winLines, randomResult: randomResult};
    };

}

class SlotView {

    constructor(canvas, soundManager) {
        this.soundManager = soundManager;
        this.model = new SlotModel();

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.colBoxW = 136;
        this.colBoxH = 392;

        this.colBoxX = [448, 599, 748, 896, 1044].map(x => x - this.colBoxW / 2 - 6);
        this.colBoxY = 242 - this.colBoxH / 2 - 19;

        this.rowHeight = Math.floor(this.colBoxH / 3);

        this.load();

        this.rowCount = 7;
        this.colCount = 5;

        this.columns = [
            [0, 1, 2, 3, 4, 5, 1],
            [0, 1, 2, 3, 4, 5, 1],
            [0, 1, 2, 3, 4, 5, 1],
            [0, 1, 2, 3, 4, 5, 1],
            [0, 1, 2, 3, 4, 5, 1],
        ];

        //this.columns = [...Array(this.colCount)].map(() => this.model.createRandomItems(this.rowCount));

        this.colMoveList = [...Array(this.colCount)].map(() => 0);

        this.state = SlotState.IDLE;

        this.lastTime = 0;
        this.skipFrames = 2;

        this.showLineCount = 0;

        this.stateText = 'Please place your bet';

        this.lineColors = [
            '#628ec6',
            '#ed2d2e',
            '#4b8c3f',
            '#ebd94d',
            '#b16c9c',
            '#a4c455',
            '#a47b70',
            '#7a9298',
            '#f2bb77',
            '#a56fb5'
        ];

    }

    load() {
        this.bg = new Image();
        this.bg.src = 'img/slot/slotBG.svg';

        this.itemImages = [];

        for (let i = 0; i < 6; i++) {
            const img = new Image();
            img.src = 'img/slot/item' + i + '.svg';

            this.itemImages[i] = img;
        }

        this.lineImages = [];

        for (let i = 0; i < 10; i++) {
            const img = new Image();
            img.src = 'img/slot/line' + (i + 1) + '.svg';

            this.lineImages[i] = img;
        }

        this.colBg = new Image();
        this.colBg.src = 'img/slot/colBg.svg';

        this.soundBetLoop = this.soundManager.createSound('sounds/rotate.mp3', true);
        this.soundWait = this.soundManager.createSound('sounds/wait.mp3', true);
    }

    update(time) {
        //if (this.skipFrames-- > 0) return;
        //this.skipFrames = 1;

        const dTime = time - this.lastTime;
        this.lastTime = time;

        this.dpr = 1;//window.devicePixelRatio || 1;
        //log('this.dpr ========', this.dpr)

        const rect = this.canvas.getBoundingClientRect();

        //log(rect)

        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;

        if (this.canvas.width < 950) {
            this.canvasScale = this.canvas.width / 950;
            this.bgX = (this.canvas.width - this.bg.width * this.canvasScale) / 2;

            this.canvas.height = this.bg.height * this.canvasScale;
            this.canvas.style.height = this.canvas.height + 'px';

        } else {
            this.canvasScale = this.bg.height / this.canvas.height;
            this.bgX = (this.canvas.width - this.bg.width) / 2;

            this.canvas.height = this.bg.height;
            this.canvas.style.height = this.canvas.height + 'px';
        }


        this.ctx.setTransform(this.dpr * this.canvasScale, 0, 0, this.dpr * this.canvasScale, this.bgX, 0);


        this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        this.ctx.drawImage(this.bg, 0, 0);

        this.drawColumns();

        switch (this.state) {
            case SlotState.IDLE_AFTER_WIN:
                this.drawWinLines(time, dTime);
                break;
            case SlotState.BET:
                this.colIdle(0, dTime);
                break;

        }

        for (let i = 0; i < this.showLineCount; i++) {
            this.drawLine(i);
        }


        this.drawText(this.stateText, 747, 477 - 20, 18);
    }

    drawText(text, x, y, size) {
        this.ctx.font = size + "px Arial";
        this.ctx.fillStyle = "#ffffffFF";//"#ffffffcc";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, x, y);
    }

    drawLine(lineIndex) {
        const lineY = [234, 117, 351, 77, 81, 195, 83, 156, 156, 38];
        this.ctx.drawImage(this.lineImages[lineIndex], 362, lineY[lineIndex] - 20);
    }

    colIdle(fromIndex, dTime) {
        for (let colIndex = fromIndex; colIndex < 5; colIndex++) {
            this.setNextRows(colIndex, this.model.createRandomItems(3));

            this.colMoveList[colIndex] = (this.colMoveList[colIndex] + dTime * 2) % (this.rowHeight * this.rowCount);
        }
    }

    drawColumns() {
        for (let i = 0; i < 5; i++) {
            this.drawColumn(i);
        }
    }

    setNextRows(colIndex, rows) {
        const firstIndex = this.getFirstRowIndex(colIndex);
        const column = this.columns[colIndex];

        for (let i = 0; i < rows.length; i++) {
            let i0 = (firstIndex - rows.length + i) % column.length;
            if (i0 < 0) i0 += column.length;

            column[i0] = rows[i];
        }
    }

    getFirstRowIndex(colIndex) {
        const column = this.columns[colIndex];
        return column.length - Math.floor((this.colMoveList[colIndex] / this.rowHeight) % column.length) - 1;
    }

    drawColumn(colIndex) {
        const colBoxX = this.colBoxX[colIndex];
        const column = this.columns[colIndex];

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(colBoxX, this.colBoxY, this.colBoxW, this.colBoxH);
        this.ctx.clip();

        this.ctx.fillStyle = "#242424";
        this.ctx.fillRect(colBoxX, this.colBoxY, this.colBoxW, this.colBoxH);

        let moveY = this.colMoveList[colIndex];

        let rowIndex = this.getFirstRowIndex(colIndex);


        this.ctx.drawImage(this.colBg, colBoxX + 10, this.colBoxY + (moveY % this.rowHeight - this.rowHeight));
        this.ctx.drawImage(this.colBg, colBoxX + 10, this.colBoxY + (moveY % this.rowHeight - this.rowHeight) + this.colBoxH);


        for (let i = 0; i < 5; i++) {

            const itemIndex = column[rowIndex];
            const item = this.itemImages[itemIndex];

            //console.log(moveY, moveY % this.rowHeight, (moveY % this.rowHeight - this.rowHeight), rowIndex, itemIndex, item);

            const x0 = (this.colBoxW - item.width) / 2;
            const y0 = (this.rowHeight - item.height) / 2;


            //this.ctx.drawImage(item, colBoxX + x0, y0 + this.colBoxY + (moveY % this.rowHeight - this.rowHeight) + this.rowHeight * i);

            this.drawItem(itemIndex, colIndex, i, (moveY % this.rowHeight - this.rowHeight));

            rowIndex = (rowIndex + 1) % column.length;
        }

        this.ctx.restore();
    }

    drawItem(itemIndex, colIndex, rowIndex, dy, scale = 1) {
        const colBoxX = this.colBoxX[colIndex];

        const item = this.itemImages[itemIndex];

        const itemWidth = item.width * scale;
        const itemHeight = item.height * scale;

        const x0 = (this.colBoxW - itemWidth) / 2;
        const y0 = (this.rowHeight - itemHeight) / 2;

        this.ctx.drawImage(item, colBoxX + x0, y0 + this.colBoxY + dy + this.rowHeight * rowIndex, itemWidth, itemHeight);
    }

    createBetStart() {
        this.state = SlotState.BET;
        this.stateText = 'Good luck!';

        this.showLineCount = 0;
        this.winState = null;
        this.currentWinLineTime = 0;

        //setTimeout(() => this.win(this.model.createRandomItems(15)), 1000);

        this.soundBetLoop.currentTime = 0;
        this.soundBetLoop.play();
        this.soundWait.pause();
    }

    showLines(lineCount) {
        this.showLineCount = lineCount;
        this.state = SlotState.IDLE;
        this.soundManager.createSoundPlay('sounds/line.mp3');
    }


    win(randomResult, onComplete) {
        this.state = SlotState.WIN;

        const stopCol = (colIndex, onComplete) => {
            let lastTime = 0;

            this.setNextRows(colIndex, [randomResult[colIndex], randomResult[colIndex + 5], randomResult[colIndex + 10]]);

            setTimeout(() => {
                this.soundManager.createSoundPlay('sounds/stopCol.mp3');
            }, 100);

            new TWEEN.Tween(this.colMoveList)
                .easing(TWEEN.Easing.Elastic.Out)
                .to({[colIndex]: this.colMoveList[colIndex] + this.rowHeight * 3 - (this.colMoveList[colIndex] % this.rowHeight - this.rowHeight)}, 200)
                .onUpdate(() => {
                    const time = (new Date()).getTime();
                    const dTime = time - lastTime;
                    lastTime = time;
                    this.colIdle(colIndex + 1, dTime);
                })
                .onComplete(() => {
                    if (onComplete) onComplete();
                })
                .start();
        };

        stopCol(0, () => {
            stopCol(1, () => {
                stopCol(2, () => {
                    stopCol(3, () => {
                        stopCol(4, () => {
                            this.soundBetLoop.pause();

                            this.state = SlotState.IDLE_AFTER_WIN;
                            this.winState = this.model.getWinData(randomResult);
                            this.currentWinLineTime = 0;
                            this.showWinItemTime = 1000;
                            this.currentWinLine = 0;

                            if (this.winState.winLines.length) {

                                this.soundManager.createSoundPlay('sounds/win' + 1 + '.mp3');
                            }

                            setTimeout(onComplete, this.winState.winLines.length * this.showWinItemTime);
                        });
                    });
                });
            });
        });

    }


    drawWinLine(time, dTime, winLine) {
        const line = this.model.linesAll[winLine.lineIndex];

        for (let j = 0; j < winLine.winItems.length; j++) {
            const itemIndex = line[winLine.winItems[j]];

            const colIndex = itemIndex % 5;
            const rowIndex = Math.floor(itemIndex / 5);
            //this.ctx.drawImage(this.rectImages[lineIndex], this.colBoxX[colIndex], this.colBoxY + this.rowHeight * rowIndex);

            const x = this.colBoxX[colIndex];
            const y = this.colBoxY + this.rowHeight * rowIndex;

            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(x, y, 138, 138);

            let b = 2;
            this.ctx.fillStyle = this.lineColors[winLine.lineIndex];
            this.ctx.fillRect(x + b, y + b, 138 - b * 2, 138 - b * 2);

            b = 5;
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(x + b, y + b, 138 - b * 2, 138 - b * 2);

            this.drawItem(this.winState.randomResult[itemIndex], colIndex, rowIndex, 0, 1 + Math.sin(time * Math.PI / this.showWinItemTime) / 10);

            if (!j) {

                this.ctx.fillStyle = "#000000";

                const h = 40;

                this.ctx.fillRect(x + 10, y - 10, 118, h);

                let b = 2;
                this.ctx.fillStyle = this.lineColors[winLine.lineIndex];
                this.ctx.fillRect(x + 10 + b, y - 10 + b, 118 - b * 2, h - b * 2);

                b = 5;
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(x + 10 + b, y - 10 + b, 118 - b * 2, h - b * 2);

                this.drawText(Math.floor(winLine.mult * this.model.betAmountSum / this.model.betLineCount) + ' TRX', x + 10 + 118 / 2, y - 10 + 26, 15);
            }

        }
    }

    drawWinLines(time, dTime) {

        if (this.winState) {

            if (this.winState.winLines.length) {

                this.ctx.fillStyle = "rgba(0,0,0,0.5)";

                for (let i = 0; i < 5; i++) {
                    this.ctx.fillRect(this.colBoxX[i], this.colBoxY, this.colBoxW, this.colBoxH);
                }

                this.currentWinLineTime += dTime;

                if (this.currentWinLineTime >= this.showWinItemTime) {
                    this.currentWinLineTime = 0;

                    this.currentWinLine = (this.currentWinLine + 1);

                    if (this.currentWinLine >= this.winState.winLines.length) {
                        this.showWinItemTime = 2000;
                        this.currentWinLine %= this.winState.winLines.length;
                        //this.soundWait.play();
                    }

                    if (this.showWinItemTime < 2000) {
                        this.soundManager.createSoundPlay('sounds/win' + (this.currentWinLine + 1) + '.mp3');
                    }
                }

                const winLine = this.winState.winLines[this.currentWinLine];

                if (winLine.mult) {
                    this.drawLine(winLine.lineIndex);

                    this.drawWinLine(this.currentWinLineTime, dTime, winLine);
                }

            }

            //this.stateText = `Total win: ${this.model.betAmount} x ${this.winState.winMultSum} = ${this.model.betAmount * this.winState.winMultSum} TRX`;

            let winAmount = this.model.betAmountSum * this.winState.winMultSum / this.model.betLineCount;
            if (winAmount != Math.floor(winAmount)) winAmount = winAmount.toFixed(2);
            this.stateText = `Total win: ${winAmount} TRX`;
        }
    }

    stopBetError(err) {
        this.state = SlotState.IDLE;

        this.stateText = err.toString();
        this.soundBetLoop.pause();

    }

}
const SlotState = {
    IDLE: 'IDLE',
    BET: 'BET',
    WIN: 'WIN',
    IDLE_AFTER_WIN: 'IDLE_AFTER_WIN',
};
