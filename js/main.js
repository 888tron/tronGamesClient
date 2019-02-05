const gameManagerAddress = 'TGtGhthzyLBYPUKDysXX1YSgRKPYVTQuMe';
const dividendsDataAddress = 'TP52deyiu4Ptu986xSVgoju8bbqjG8r96u';
const dividendsControllerAddress = 'TWtpFqRon6CHXQ2e2jh8NHgtJesVVymn9H';

const wheelAddress = 'TPYxogE1aB61DhviZdqKsVJVkNhx85hxUC';
const cardsAddress = 'TUzUzggx2zvSpaqs5BisoN1TWqQ9atuEfn';

const games = [cardsAddress, wheelAddress];

const tokenAddress = 'TLvDJcvKJDi3QuHgFbJC6SeTj3UacmtQU3';
const referralsAddress = 'TAKkt9G5uUZyHJ3tYSYhpt7B6Bmksh1TVX';
const wheelWinIndexAddress = 'TKj4wydhn3ADnWBmLiW5rAv7AEVToJy43v';

const host = 'https://888tron.com';
//const host = 'http://localhost:3000';

const app = this;

app.minBet = 50;
app.maxBet = 5000;
app.betAmount = minBet;
app.wheelValues = [0, 6, 2, 5, 2, 10, 2, 5, 2, 6, 2, 5, 2, 6, 2, 10, 2, 5, 2, 20, 2];
app.currentTableIndex = 1;
app.newMyBets = [];

const GameViewState = {
    IDLE: 1,
    BET: 2,
    WIN: 3,
    WIN_IDLE: 4,
};

var gameViewState = GameViewState.IDLE;


/*const fullNode = new HttpProvider('https://api.shasta.trongrid.io');
const solidityNode = new HttpProvider('https://api.shasta.trongrid.io');
const eventServer = 'https://api.shasta.trongrid.io/';*/

/*const fullNode = 'https://super.guildchat.io';
const solidityNode = 'https://solidity.guildchat.io';
const eventServer = 'https://api.trongrid.io';*/

//const fullNode = 'https://super.guildchat.io';
const fullNode = 'https://api.trongrid.io';
const solidityNode = 'https://api.trongrid.io';
const eventServer = 'https://api.trongrid.io';

window.onload = function () {
    /*if (!window.tronWeb) {

        console.log("create TronWeb!");

        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider('https://api.shasta.trongrid.io');
        const solidityNode = new HttpProvider('https://api.shasta.trongrid.io');
        const eventServer = 'https://api.shasta.trongrid.io/';

        this.tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
        );

    }*/

    app.lastTronLinkAddress = getTronlinkAddress();

    const watchTronlinkAddress = () => {
        if (app.lastTronLinkAddress !== getTronlinkAddress()) {
            app.lastTronLinkAddress = getTronlinkAddress();
            onTronlinkAddressChange();
        }
        setTimeout(watchTronlinkAddress, 1000);
    };

    watchTronlinkAddress();
    onTronlinkAddressChange();

    if (getTronlinkAddress()) {

        log('tronlink', this.tronWeb.defaultAddress.base58);

        gtag('config', 'GA_TRACKING_ID', {
            'user_id': getTronlinkAddress()
        });
    }

    updateDividendsData();
};

function getTronWeb(isTronlink) {
    if (isTronlink) return Promise.resolve(this.tronWeb);
    if (app.tronWeb2) {
        //log('get tronWeb2 from cache');
        return Promise.resolve(app.tronWeb2);
    }

    let nodes = ['https://api.trongrid.io', 'https://super.guildchat.io'];
    const host = nodes[0];

    const HttpProvider = TronWeb.providers.HttpProvider;

    app.tronWeb2 = new TronWeb(new HttpProvider(host),
        new HttpProvider(host),
        host,
        'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0');

    return Promise.resolve(app.tronWeb2);


    const tryGetTronWeb = (_nodes) => {
        const nodes = _nodes.concat();
        const host = nodes.shift();
        const tronWeb = new TronWeb(new HttpProvider(host),
            new HttpProvider(host),
            host,
            'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0');
        return tronWeb.contract().at(dividendsDataAddress).then(contract => {
            logLine('tryGetTronWeb ' + host + ' is valid');
            return tronWeb;
        }).catch(err => {
            logError('tryGetTronWeb ' + host, err);
            return tryGetTronWeb(nodes);
        });
    };

    return tryGetTronWeb(nodes).then(tronWeb => {
        app.tronWeb2 = tronWeb;
        return tronWeb;
    })
}

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

requestAnimationFrame(animate);

/*getAddressToUserId('TR6ysKvngUPr7RdhRwWfKMACaVbRQz8iKw').then(userId => {
    post('/api/getUserIdRewards', {userId: userId}).then(sum => {

        log('getUserIdRewards ' + userId, sum);
    });
});*/

function start() {

    post('/api/getGameState').then(_gameState => {
        //logJson('getGameState',_gameState);

        app.gameState = _gameState;

        app.gameStateBetCount = app.gameState.betCount;

        updateReferralLink();
        updateMyBalance();
        updateMyHistory();
        updateTopTable();

        updateTables();

        guiInit();

    });
}

function onDividendShow() {
    updateDividendsData();
    $('#dividendsModal').modal('show');

    app.dividendsModalTimer = setInterval(updateDividendsData, 1000);
}


function onTronlinkAddressChange() {
    log('onTronlinkAddressChange');

    if (getTronlinkAddress()) {
        getParentUserId(app.parentRef)
            .then(parentData => {
                logLine('parentUserId', parentData);
                app.parentUserId = parentData.userId;
                app.parentRef = parentData.ref;
                app.parentAddress = parentData.parentAddress;
            });
    }

    app.myBalance = 0;
    start();
}

function updateDividendsData() {
    //log('updateDividendsData');

    const currentTime = (new Date()).getTime();
    const lastTime = 1543665600000;
    const targetTime = 1549540800000;

    $('.dividendsProgressText').html(elapsedTimeToString(targetTime - currentTime));

    $('.dividendsProgress')
        .css("width", Math.ceil(((currentTime - lastTime) / (targetTime - lastTime)) * 100) + "%")
        .attr("aria-valuenow", (currentTime - lastTime))
        .attr("aria-valuemax", (targetTime - lastTime));


    const money = (value, f) => {
        return ((value.toNumber ? value.toNumber() : value) / 1000000).toFixed(f === undefined ? 2 : f);
    };

    getContract(dividendsDataAddress).then(dividendsData => {
        dividendsData.getCurrentLevel().call()
            .then(level => {
                let _level = level.toNumber();

                $('.dividendsCurrentStage').html(_level + 1);
                $('.dividendsNextStage').html(_level + 2);

                $('.dividendsCurrentStagePrice').html(700 + _level * 20);
                $('.dividendsNextStagePrice').html(700 + (_level + 1) * 10);


                if (getTronlinkAddress()) {

                    dividendsData.getPlayerToFrozenAmount(getTronlinkAddress()).call()
                        .then(playerFrozen => {
                            //log('playerFrozen ' + getTronlinkAddress(), playerFrozen);

                            $('.dividendsUnfreezableTokens').html(money(playerFrozen));

                            dividendsData.getLevelToDividends(_level).call()
                                .then(dividends => {
                                    $('.dividendsSum').html(money(dividends) + ' TRX');

                                    getBalance(gameManagerAddress).then(gameBalance => {
                                        log('dividends', dividends);
                                        log('gameBalance', gameBalance);

                                        log('gameBalance/dividends', gameBalance / dividends);

                                    });

                                    dividendsData.getLevelToFrozenSum(_level).call()
                                        .then(levelFrozen => {

                                            dividendsData.getPlayersTokenSum().call()
                                                .then(playersTokenSum => {

                                                    $('.dividendsTokenFrozen').html(money(levelFrozen, 0) + ' Tokens 888');

                                                    $('.dividendsTokenMined').html(money(playersTokenSum * 100 / 65, 0) + ' Tokens 888');

                                                    $('.dividendsAvailableWithdraw').html(money(
                                                        dividends.toNumber() * playerFrozen.toNumber() / levelFrozen.toNumber()
                                                    ) + ' TRX');

                                                });
                                        });

                                });


                            getContract(tokenAddress).then(token => {
                                token.balanceOf(getTronlinkAddress()).call().then(balance => {
                                    $('.dividendsFreezableTokens').html(money(balance));


                                    $('.Token888Count').html(money(balance.toNumber() + playerFrozen.toNumber()));

                                });
                            });
                        });
                } else {
                    dividendsData.getLevelToDividends(_level).call()
                        .then(dividends => {
                            $('.dividendsSum').html(money(dividends) + ' TRX');

                            dividendsData.getLevelToFrozenSum(_level).call()
                                .then(levelFrozen => {

                                    dividendsData.getPlayersTokenSum().call()
                                        .then(playersTokenSum => {

                                            $('.dividendsTokenFrozen').html(money(levelFrozen, 0) + ' Tokens 888');

                                            $('.dividendsTokenMined').html(money(playersTokenSum * 100 / 65, 0) + ' Tokens 888');

                                        });
                                });
                        });
                }


            });


        if (getTronlinkAddress()) {
            getContract(dividendsControllerAddress, true).then(dividendsController => {

                dividendsController.mintTokenAvailable(getTronlinkAddress()).call()
                    .then(myMintTokenAvailable => {

                        //log('myMintTokenAvailable', myMintTokenAvailable);

                        $('.dividendsMintableTokens').html(money(myMintTokenAvailable));
                    });


            });
        }
    });
}

const contracts = {true: {}, false: {}};

function getContract(address, isTronlink = false) {

    const contract = contracts[isTronlink][address];
    if (contract) return Promise.resolve(contract);

    return getTronWeb(isTronlink).then(tronweb => {
        return tronweb.contract().at(address).then(contract => {
            contracts[isTronlink][address] = contract;
            return contract;
        }).catch(err => {
            logError('getContract ' + address, err);
            return delay(100).then(() => {
                return getContract(address);
            });
        })
    });
}

function updateMyBalance() {

    if (getTronlinkAddress()) {
        this.tronWeb.trx.getUnconfirmedBalance().then(balance => {
            const newBalance = balance / 1000000;

            if (app.myBalance && app.myBalance < newBalance) {

                if (app.tweenMyBalance) app.tweenMyBalance.stop();

                app.tweenMyBalance = new TWEEN.Tween(app)
                    .to({myBalance: newBalance}, 5000)
                    .onUpdate(() => {
                        $('.myBalance').html(dictionary['balance'] + ': ' + app.myBalance.toFixed(4) + ' TRX');
                    })
                    .start();

            } else {
                app.myBalance = newBalance;
                $('.myBalance').html(dictionary['balance'] + ': ' + newBalance.toFixed(4) + ' TRX');
            }

        });
    }
}

function trx(balance) {
    return Math.round(balance / 1000000) + ' TRX';
}

function setBetX2() {
    setBetAmount(app.betAmount * 2);
}

function setBetX1_2() {
    setBetAmount(app.betAmount / 2);
}

function setBetMin() {
    setBetAmount(app.minBet);
}

function setBetMax() {
    setBetAmount(app.maxBet);
}

function setBetAmount(value) {

    if (value > app.myBalance - 1) value = app.myBalance - 1;

    value = Math.floor(value);

    if (value < app.minBet) value = app.minBet;
    if (value > app.maxBet) value = app.maxBet;

    log('app.minBet', app.minBet);
    log('app.maxBet', app.maxBet);
    log('app.myBalance', app.myBalance);

    log('validateBetAmount ' + value);

    $('.betAmount').val(value);

    log('app.betAmount', app.betAmount);
    app.betAmount = value;

    updateChances();
}

const addressToRef = {};
const addressRefIsLoading = {};

function addressToShort(address) {
    let ref = addressToRef[address];
    if (ref) return strToShort(ref);

    if (!addressRefIsLoading[address]) {
        addressRefIsLoading[address] = true;
        getAddressToRefLink(address).then(info => {
            if (info) {
                app.isNeedUpdateTopTable = true;
                addressToRef[address] = info.ref;
            }
        });
    }

    return strToShort(address);
}

function strToShort(str) {
    if (str.length < 15) return str;
    return str.substr(0, 5) + "...." + str.substr(str.length - 5, 5);
}

function td(value) {
    return '<td>' + value + '</td>';
}

function timeToString(t) {
    var date = new Date(t);
    //date.setTime(t);

    var d = s => {
        return s.toString().length === 2 ? s : ('0' + s);
    };

    return d(date.getHours()) + ":" + d(date.getMinutes()) + ":" + d(date.getSeconds());
}

function elapsedTimeToString(t) {
    t = Math.floor(t / 1000);

    const seconds = t % 60;
    const minutes = Math.floor(t / 60) % 60;
    const hours = Math.floor(t / (60 * 60)) % 24;
    const days = Math.floor(t / (3600 * 24));

    var d = s => {
        return s.toString().length === 2 ? s : ('0' + s);
    };

    return d(days) + ":" + d(hours) + ":" + d(minutes) + ":" + d(seconds);
}

function updateTopTable() {
    setSideTableData($('#sideTable > tbody:last'), app.gameState.listTopBetSum);
}

function updateMyHistory() {
    if (app.currentGameIndex === 0) {
        setHistoryTableData0($('.history-table-0 > div:last'), app.gameState.listPlayerBets[app.currentGameIndex]);
    } else {
        setHistoryTableData1($('.history-table-1 > div:last'), app.gameState.listPlayerBets[app.currentGameIndex]);
    }
}

let gridContext = null;
var gridCanvas;

function updateCanvasTable() {
    if (!gridContext) {

        const pixelRatio = window.devicePixelRatio || 1;

        const grid = $('#grid');

        gridCanvas = $('<canvas/>', {
            id: 'tableCanvas'
        });

        grid.append(gridCanvas);
        gridCanvas = document.getElementById("tableCanvas");

        gridContext = gridCanvas.getContext('2d');

        gridContext.scale(pixelRatio, pixelRatio);

        const onResize = () => {

            log('grid size ' + grid.width() + ' ' + grid.height());
            log('pixelRatio', pixelRatio);

            gridCanvas.width = grid.width() * pixelRatio;
            gridCanvas.height = grid.height() * pixelRatio;

            gridCanvas.style.width = gridCanvas.width + "px";
            gridCanvas.style.height = gridCanvas.height + "px";

            updateTables();
        };

        window.addEventListener('resize', onResize, false);
        onResize();
    }

    switch (app.currentTableIndex) {
        case 0:
            setTableDataGrid(app.gameState.listPlayerBets[app.currentGameIndex]);
            break;
        case 1:
            setTableDataGrid(app.gameState.listBetsAll);
            break;
        case 2:
            setTableDataGrid(app.gameState.listBetsBigAmount);
            break;
        case 3:
            setTableDataGrid(app.gameState.listBetsRareValue);
            break;
    }
}

function getCurrantDataProvider() {
    switch (app.currentTableIndex) {
        case 0:
            return app.gameState.listPlayerBets[app.currentGameIndex];
        case 1:
            return app.gameState.listBetsAll;
        case 2:
            return app.gameState.listBetsBigAmount;
        case 3:
            return app.gameState.listBetsRareValue;
    }
    return null;
}

function updateTables() {

    setTableData($('#mainTable > tbody:last'), getCurrantDataProvider());

    const newTotalWon = Math.round(app.gameState.winSum);

    const newTotalBetAmount = app.gameState.betSum;

    //log('TotalBetAmount', newTotalBetAmount);

    const newBetCount = app.gameState.betCount;

    if (app.betsCount) {

        if (app.tweenBetsCount) app.tweenBetsCount.stop();
        if (app.tweenTotalWon) app.tweenTotalWon.stop();

        app.tweenBetsCount = new TWEEN.Tween(app)
            .to({betsCount: newBetCount}, 5000)
            .onUpdate(() => {
                $('.betsCount').html(Math.round(app.betsCount));
            })
            .start();

        app.tweenTotalWon = new TWEEN.Tween(app)
            .to({
                totalWon: newTotalWon
            }, 5000)
            .onUpdate(() => {
                $('.totalWon').html(Math.round(app.totalWon) + ' TRX');
            })
            .start();
    } else {
        app.betsCount = newBetCount;
        app.totalWon = newTotalWon;

        $('.betsCount').html(newBetCount);
        $('.totalWon').html(newTotalWon + ' TRX');
    }
}

function isMyBet(bet) {
    return getTronlinkAddress() && bet.player === this.tronWeb.defaultAddress.base58;
}

function setTableData(table, data) {
    var rows = '';

    const cardsCount = 52;

    for (var i = data.length - 1; i >= 0; i--) {
        var bet = data[i];

        const gameIndex = getGameIndex(bet.game);

        let betValue = 'x' + bet.betValue;
        let winValue = (bet.winValue < 21 ? ('x' + bet.winValue) : '-');

        if (gameIndex === 0) {
            if (bet.betValue < cardsCount) {
                betValue = cardType(bet.betValue) + '<';
            } else if (bet.betValue < cardsCount * 2) {
                betValue = cardType(bet.betValue - cardsCount) + '=';
            } else {
                betValue = cardType(bet.betValue - cardsCount * 2) + '>';
            }

            winValue = cardType(bet.winIndex);
        }

        //  if (bet.winValue < 21) {
        rows +=
            '<tr>' +
            td(timeToString(bet.time)) +
            // td(bet.id) +
            td(bet.blockNumber) +
            td(addressToShort(bet.player)) +

            td(betValue) +
            td(winValue) +
            td(bet.amount + ' TRX') +
            td(parseFloat(bet.winAmount).toFixed(2) + ' TRX') +
            '</tr>';
        //  }
    }

    table.html(rows);

}

function setTableDataGrid(data) {

    const cardsCount = 52;

    let paddingLeft = 80;
    let x = paddingLeft;
    let y = 30;
    const dy = 40;
    const dx = (gridCanvas.width - paddingLeft * 2) / 6;

    const grid = $('#grid');

    //log('grid.width() ==== ', grid.width());

    gridContext.font = (grid.width() > 500 ? 17 : 2) + 'px Arial';

    //log('gridCanvas.width', gridCanvas.width);

    gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    const fillText = (text) => {
        let size = gridContext.measureText(text);

        gridContext.fillText(text, x - size.width / 2, y);
        x += dx;
    };

    gridContext.fillStyle = 'white';

    [
        dictionary['time'],
        dictionary['block'],
        dictionary['player'],
        dictionary['prediction'],
        dictionary['result'],
        dictionary['bet'],
        dictionary['payout']
    ].forEach(text => {
        fillText(text);
    });
    /*
        gridContext.strokeStyle = 'rgba(225,0,225,1)';
        gridContext.beginPath();
        gridContext.moveTo(x, y);
        gridContext.lineTo(gridCanvas.width, y);
        //gridContext.stroke();*/

    x = paddingLeft;
    y += dy;

    for (var i = data.length - 1; i >= 0; i--) {
        var bet = data[i];

        const gameIndex = getGameIndex(bet.game);

        let betValue = 'x' + bet.betValue;
        let winValue = (bet.winValue < 21 ? ('x' + bet.winValue) : '-');

        if (gameIndex === 0) {
            if (bet.betValue < cardsCount) {
                betValue = cardTypeText(bet.betValue) + '<';
            } else if (bet.betValue < cardsCount * 2) {
                betValue = cardTypeText(bet.betValue - cardsCount) + '=';
            } else {
                betValue = cardTypeText(bet.betValue - cardsCount * 2) + '>';
            }

            winValue = cardTypeText(bet.winIndex);
        }

        if (i % 2) {
            gridContext.fillStyle = 'rgba(225,225,225,0.08)';
            gridContext.strokeStyle = 'white';
            gridContext.lineWidth = 0.2;
            gridContext.fillRect(0, y - 25, gridCanvas.width, dy);
            gridContext.strokeRect(-4, y - 25, gridCanvas.width + 8, dy);
        }

        gridContext.fillStyle = 'white';

        fillText(timeToString(bet.time));
        fillText(bet.blockNumber);
        fillText(addressToShort(bet.player),);
        fillText(betValue);
        fillText(winValue);
        fillText(bet.amount + ' TRX');
        fillText(parseFloat(bet.winAmount).toFixed(2) + ' TRX');

        x = paddingLeft;
        y += dy;
    }

}

function level(sum) {
    return Math.max(Math.floor(Math.log2(sum / 100 + 1)), 1);
}

function setSideTableData(table, data) {
    const n = Math.min(data.length, 20);

    var rows = '';

    for (var i = 0; i < n; i++) {
        var player = data[i];

        rows +=
            '<tr>' +
            td(i + 1) +
            td('lv. ' + level(player.sum) + ' ' + addressToShort(player.player)) +
            td(player.sum + ' TRX') +
            '</tr>';
    }

    table.html(rows);
}

function setHistoryTableData0(table, data) {
    data = data.concat().reverse();

    var rows = '';
    for (var i = 0; i < 30; i++) {
        let bet = data[i];
        rows +=
            '<div class="item col-4 p-1">' +
            (i < data.length ? cardTypeHistory(bet.winValue, (i < data.length && bet.winAmount > 0 ? 'good' : 'white')) : ' ')
            + '</div>';
    }

    table.html(rows);
}

function setHistoryTableData1(table, data) {
    data = data.concat().reverse();

    //log('setHistoryTableData1', data)

    var rows = '';
    for (var i = 0; i < 30; i++) {
        let bet = data[i];
        rows +=
            '<div class="item col-4 p-1 ' + (i < data.length && bet.winAmount > 0 ? 'good' : '') + '">' +
            (i < data.length ? bet.winValue : ' ')
            + '</div>';
    }

    table.html(rows);
}

function onFairness() {
    var playerAddress = $('#betId').val();
    var blocknumber = $('#blocknumber').val();

    if (playerAddress && blocknumber) {
        getBlock(blocknumber).then(block => {
            getContract(cardsAddress).then(contract => {
                contract.getWinIndexFromHash(playerAddress, '0x' + block.hash).call().then(res => {
                    $('#randomResult0').html(cardType(res));
                })
            });
            getContract(wheelAddress).then(contract => {
                contract.getWinIndexFromHash(playerAddress, '0x' + block.hash).call().then(res => {
                    $('#randomResult1').html(('x' + app.wheelValues[res].toString()));
                })
            })
        });
    }
}

function setSpinEnable(value) {
    $('#spinButton').prop("disabled", !value);
    $('#drawButton').prop("disabled", !value);
    if (value) {
        enableControls();
    } else {
        disableControls();
    }
}

var isLoaded = false;

function onLoadComplete() {
    log('onLoadComplete');

    if (!isLoaded) {
        isLoaded = true;
        $('#myHeader').addClass('fixed-top');
        $('#before-load').find('i').fadeOut().end().delay(200).fadeOut('slow');
    }
}

function getTransactionInfo(transactionID) {
    return getTronWeb(false).then(tronweb => {

        return tronweb.solidityNode.request('walletsolidity/gettransactioninfobyid', {
            value: transactionID
        }, 'post')
    });

}

function getTransaction(transactionID) {
    return getTronWeb(false).then(tronweb => {

        return tronweb.fullNode.request('wallet/gettransactionbyid', {
            value: transactionID
        }, 'post')
    });

}

function getUrlVars() {
    var vars = {};
    var href = document.location.href;
    var tmp = document.location.search.substr(1).split('&');
    var i = tmp.length;
    while (i--) {
        var v = tmp[i].split('=');
        vars[v[0]] = decodeURIComponent(v[1]);
    }
    return vars;
}

const refStart = 'https://888tron.com/?r=';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


function getCurrentBlockNumber() {
    const duration = 1000;

    return getTronWeb(false).then(tronweb => {

        return tronweb.trx.getCurrentBlock().then(block => {
            if (!block) {
                log('getCurrentBlockNumber is null');
                return delay(duration).then(() => {
                    return getCurrentBlockNumber();
                });
            }
            log('getCurrentBlockNumber', block.block_header.raw_data.number + ' ' + block.blockID);

            return block.block_header.raw_data.number;
        }).catch(err => {
            logError('getCurrentBlockNumber', err);

            return delay(duration).then(() => {
                return getCurrentBlockNumber();
            });
        });
    });
}


function getCurrentBlockNumber2() {
    return post('/api/getCurrentBlock').then(block => {
        if (!block) {
            log('getCurrentBlockNumber2 is null');
            return delay(100).then(() => {
                return getCurrentBlockNumber2();
            });
        }
        logLine('getCurrentBlockNumber2', block.blockNumber);

        return block.blockNumber;
    }).catch(err => {
        logError('getCurrentBlockNumber2', err);

        return delay(100).then(() => {
            return getCurrentBlockNumber2();
        });
    });
}

function findTx(txId) {
    return getTronWeb(false).then(tronweb => {

        return tronweb.trx.getTransactionInfo(txId).then(txInfo => {
            log('getTransactionInfo');
            log(txInfo);

            if (Object.values(txInfo).length === 0) {
                return delay(3000).then(() => {
                    return findTx(txId);
                });
            }
        }).catch(err => {
            logError('getTransactionInfo', err);

            return delay(3000).then(() => {
                return findTx(txId);
            });
        });
    });
}

function getBalance(address) {
    const duration = 1000;

    return getTronWeb(false).then(tronweb => {
        return tronweb.trx.getUnconfirmedBalance(address).then(balance => {
            log('getBalance ' + address, balance);
            return balance;
        }).catch(err => {
            logError('getBalance ' + address, err);
            return delay(duration).then(() => {
                return getBalance(address);
            });
        });
    });
}


function getBlock(blockNumber) {
    const duration = 1000;

    return getTronWeb(false).then(tronweb => {

        return tronweb.trx.getBlock(blockNumber).then(block => {
            if (!block) {
                log('getBlock is null');
                return delay(duration).then(() => {
                    return getBlock(blockNumber);
                });
            }

            const blockInfo = {
                blockNumber: blockNumber,
                hash: block.blockID
            };

            logLine('getBlock', blockInfo);

            return blockInfo;
        }).catch(err => {
            logError('getBlock', err);

            return delay(duration).then(() => {
                return getBlock(blockNumber);
            });
        });
    });
}

function findBlockByTxId(startBlockNumber, blockNumber, txId, gameIndex) {
    const duration = 1000;

    const win = app.newMyBets.find(bet => {
        return bet.blockNumber > startBlockNumber && bet.game === games[gameIndex];
    });

    if (win) {

        winBet(win, gameIndex);

        return Promise.resolve(null);
    }

    return getTronWeb(false).then(tronweb => {

        return tronweb.trx.getBlock(blockNumber).then(block => {

            log('findBlockByTxId from ' + startBlockNumber + ' current ' + blockNumber + ' ' + txId);

            if (block) {

                const tx = block.transactions ? block.transactions.find(tx => {
                    return tx.txID === txId;
                }) : null;

                const blockInfo = {
                    blockNumber: blockNumber,
                    hash: block.blockID
                };

                //logJson(blockInfo);


                if (tx) {
                    logLine('founded tx', tx);
                    const txRes = (tx.ret && tx.ret.length) ? tx.ret[0].contractRet : tx;
                    if (txRes === "SUCCESS") {
                        log('find complete', blockInfo.blockNumber);
                        return blockInfo;
                    } else {
                        stopBetError('findBlockByTxId', txRes, gameIndex);
                        return null;
                    }
                }

                blockNumber++;
            }

            return delay(duration).then(() => {
                return findBlockByTxId(startBlockNumber, blockNumber, txId, gameIndex);
            })

            //logJson('block', block);

        }).catch(err => {
            logError('findBlockByTxId', err);

            return delay(duration).then(() => {
                return findBlockByTxId(startBlockNumber, blockNumber, txId, gameIndex);
            });
        });
    });

}


function findBlockByTxId2(startBlockNumber, blockNumber, txId, gameIndex) {
    return getTronWeb(false).then(tronweb => {

        return tronweb.trx.getTransactionInfo(txId).then(txInfo => {

            if (app.gameState && app.gameState.listPlayerBets && app.gameState.listPlayerBets[gameIndex]) {

                const bet = app.gameState.listPlayerBets[gameIndex].find(bet => {
                    return bet.blockNumber >= startBlockNumber;
                });

                if (bet) {
                    winBet(bet, gameIndex);

                    return null;
                }
            }

            if (Object.values(txInfo).length > 0) {
                log(txInfo);

                log('find complete by tx 2', txInfo.blockNumber);

                blockNumber = txInfo.blockNumber;
            }

            return post('/api/getBlock', {blockNumber: blockNumber}).then(block => {

                log('findBlockByTxId2 from ' + startBlockNumber + ' current ' + blockNumber + ' ' + txId);
                //logJson(block);

                if (block) {

                    if (block.transactions.indexOf(txId) > -1) {
                        log('find complete', block.blockNumber);
                        return block;
                    }

                    blockNumber++;
                }

                return delay(1000).then(() => {
                    return findBlockByTxId2(startBlockNumber, blockNumber, txId, gameIndex);
                })

                //logJson('block', block);

            }).catch(err => {
                logError('findBlockByTxId2', err);

                return delay(1000).then(() => {
                    return findBlockByTxId2(startBlockNumber, blockNumber, txId, gameIndex);
                });
            });

        }).catch(err => {
            logError('getTransactionInfo2', err);

            return delay(1000).then(() => {
                return findBlockByTxId2(startBlockNumber, blockNumber, txId, gameIndex);
            });
        });
    });
}

function getGameIndex(address) {
    if (address === cardsAddress) return 0;
    return 1;
}

function updateGameState(gameState, bets, player) {
    const playerToBetSum = {};

    gameState.listTopBetSum.forEach(b => {
        playerToBetSum[b.player] = b.sum;
    });

    gameState.betCount += bets.length;
    gameState.listBetsAll = gameState.listBetsAll.concat(bets);

    bets.forEach(bet => {
        gameState.winSum += bet.winAmount;
        gameState.betSum += bet.amount;

        if (bet.player === player) {
            gameState.listPlayerBets[getGameIndex(bet.game)].push(bet);
        }

        if (bet.amount > 500 && bet.winAmount > 0) {
            gameState.listBetsBigAmount.push(bet);
        }

        if (bet.winAmount > bet.amount * 4) {
            gameState.listBetsRareValue.push(bet);
        }

        if (playerToBetSum[bet.player]) {
            playerToBetSum[bet.player] += bet.amount;
        } else {
            playerToBetSum[bet.player] = bet.amount;
        }
    });

    gameState.listTopBetSum = Object.keys(playerToBetSum).map(address => {
        return {player: address, sum: playerToBetSum[address]}
    }).sort((a, b) => {
        return b.sum - a.sum;
    });

    const listSize = 30;
    gameState.listBetsAll = gameState.listBetsAll.slice(-listSize);
    gameState.listPlayerBets[0] = gameState.listPlayerBets[0].slice(-listSize);
    gameState.listPlayerBets[1] = gameState.listPlayerBets[1].slice(-listSize);
    gameState.listBetsBigAmount = gameState.listBetsBigAmount.slice(-listSize);
    gameState.listBetsRareValue = gameState.listBetsRareValue.slice(-listSize);

}

var guiInited = false;

function guiInit() {
    if (!guiInited) {

        log('guiInit');

        guiInited = true;

        $('.table-tabs a').on('shown.bs.tab', function (event) {
            app.currentTableIndex = $(event.target).parent().index();
            updateTables();
        });

        $('#referralText').bind('keyup blur', function () {
                var node = $(this);
                let txt = node.val();
                node.val(txt.replace(/[^a-zA-Z0-9\_\-]/g, ''));
            }
        );

        $('.betAmount').focusout((event) => setBetAmount($(event.target).val()));

        $('#drawButton').click(() => {
            createBet(0);
        });
        $('#spinButton').click(() => {
            createBet(1);
        });

        watchLastBets();

        app.minBet = 50;
        app.maxBet = 20000;
        setBetMin();

        app.parentRef = getUrlVars()['r'];

        onLoadComplete();

        $('#dividendsModal').on('hidden.bs.modal', function (e) {
            clearInterval(app.dividendsModalTimer);
        });

        $('#referralModal').on('show.bs.modal', function (e) {
            updateReferralLink();
        })
    }
}

app.newBets = [];

setInterval(addNewBet, 200);

function addNewBet() {
    //log('addNewBet', app.newBets.length);

    if (app.newBets.length) {
        const bet = app.newBets.shift();

        updateGameState(app.gameState, [bet], getTronlinkAddress());

        // logLine('data', data);

        updateTables();
        if (app.isNeedUpdateTopTable) {
            app.isNeedUpdateTopTable = false;
            updateTopTable();
        }

        if (isMyBet(bet)) {
            updateMyHistory();
        }
    }
}

function watchLastBets() {

    return post('/api/getBets', {offset: app.gameStateBetCount}).then(data => {

            const myBets = data.filter(isMyBet);
            if (myBets.length) {

                app.newMyBets = app.newMyBets.concat(myBets);

                app.time2 = (new Date()).getTime();

                logLine('mybet!!!!!!!!!!!!!!  ' + (app.time2 - app.time0), myBets);

                updateMyBalance();

                //winBet(myBet);
            }

            app.gameStateBetCount += data.length;

            //logJson('getBets', data);

            app.newBets = app.newBets.concat(data);

            setTimeout(watchLastBets, 1000);
        },
        err => {
            setTimeout(watchLastBets, 1000);
        }
    )
}

function createBetStart(gameIndex) {
    if (gameIndex === 0) {
        createBetStartCards();
    } else {
        createBetStartWheel();
    }
}

function createBetStartWheel() {
    console.log('createBetStartWheel');

    //bet.winValue;

    //bet.winAmount;

    if (gameViewState === GameViewState.WIN_IDLE) {


        new TWEEN.Tween(app.arrowMesh.position)
            .to({x: app.arrowMesh.position.x - 2}, 500)
            .easing(TWEEN.Easing.Bounce.In)
            .start();


        new TWEEN.Tween(app)
            .to({wheelGroupRotation: 0}, 1000)
            .onComplete(() => {

                new TWEEN.Tween(app)
                    .to({wheelFloorRotation: 0}, 1000)
                    .onComplete(() => {

                        new TWEEN.Tween(app.arrowMesh.position)
                            .easing(TWEEN.Easing.Bounce.Out)
                            .to({x: app.arrowMesh.position.x + 2}, 500)
                            .onComplete(() => {
                                gameViewState = GameViewState.BET;
                            })
                            .start();

                    })
                    .start();
            }).start();

    } else {
        gameViewState = GameViewState.BET;

    }
}

function createBetStartCards() {
    console.log('createBetStartCards');

    //bet.winValue;

    //bet.winAmount;

    //move back

    resetCard();
    gameViewState = GameViewState.BET;
    loadCard();
}

function winBet(bet, gameIndex) {
    logLine('winBet ' + gameIndex, bet);
    log('app.newMyBets.length', app.newMyBets.length);

    app.newMyBets = app.newMyBets.filter(b => {
        return b.blockNumber > bet.blockNumber;
    });

    log('app.newMyBets.length', app.newMyBets.length);

    if (gameIndex === 0) {
        winBetCards(bet);
    } else {
        winBetWheel(bet);
    }
}

function winBetWheel(bet) {
    if (gameViewState !== GameViewState.BET) return;

    //onByBet(bet.id, bet.amount, betValue, isAutoBet());

    log('winValue', bet.winValue);
    log('winIndex', bet.winIndex);

    gameViewState = GameViewState.WIN;

    app.wheelRotation %= 360;


    var targetRotation = -360 * 1 + (360 / 21 * bet.winIndex);
    if (targetRotation > app.wheelRotation) targetRotation -= 360;
    targetRotation -= 360 * 1;

    log('app.wheelRotation - targetRotation', app.wheelRotation - targetRotation);

    var k = 2 / 17;

    var wheelRotationTime = (app.wheelRotation - targetRotation) / k * 1.1;

    log('wheelRotationTime', wheelRotationTime);


    log('app.wheelRotation', app.wheelRotation);
    log('targetRotation', targetRotation);


    new TWEEN.Tween(app)
        .to({wheelRotation: targetRotation}, wheelRotationTime)
        .easing(myEasing)
        //.easing(TWEEN.Easing.Bounce.Out)
        .onComplete(() => {
            gameViewState = GameViewState.WIN_IDLE;

            app.wheelFloorRotation = 0;

            app.createWinValueText(bet.winAmount + ' TRX');

            gtag('event', 'win', {
                'event_category': 'game',
                'value': bet.winAmount
            });

            new TWEEN.Tween(app.arrowMesh.position)
                .to({x: app.arrowMesh.position.x - 2}, 500)
                .easing(TWEEN.Easing.Bounce.In)
                .start();

            app.wheelGroupRotation %= 360;

            new TWEEN.Tween(app)
                .to({wheelGroupRotation: 0}, 1000)
                .onComplete(() => {

                    new TWEEN.Tween(app)
                        .to({wheelFloorRotation: 180}, 2000)
                        .easing(myEasing)
                        .onComplete(() => {

                            new TWEEN.Tween(app.arrowMesh.position)
                                .easing(TWEEN.Easing.Bounce.Out)
                                .to({x: app.arrowMesh.position.x + 2}, 500)
                                .onComplete(() => {

                                    //updateMyBalance();
                                    //updateHistoryTable();

                                    if (isAutoBet(1)) {
                                        createBet(1);
                                    } else {
                                        setSpinEnable(true);
                                    }
                                })
                                .start();

                        })
                        .start();

                }).start();


        })
        .start();

}

function winBetCards(bet) {
    log('winBetCards', gameViewState);

    if (gameViewState !== GameViewState.BET) return;

    //onByBet(bet.id, bet.amount, betValue, isAutoBet());


    //gameViewState = GameViewState.WIN;

    showCard(bet.winIndex);
    setTimeout(() => {
        showCardText(bet.winAmount);
    }, 500);

    gameViewState = GameViewState.WIN_IDLE;

    if (isAutoBet(0)) {
        setTimeout(() => {
            createBet(0);
        }, 2000);
    } else {
        setSpinEnable(true);
    }

}

function myEasing(k) {
    var t = (k * 100); // add this
    var d = 100; // add this

    var ts = (t /= d) * t;
    var tc = ts * t;
    return (0.247500000000003 * tc * ts + 0.2075 * ts * ts + -2.005 * tc + 1.2 * ts + 1.35 * t);
}

function getTronlinkAddress() {
    if (this.tronWeb && this.tronWeb.defaultAddress && this.tronWeb.defaultAddress.base58) {
        return this.tronWeb.defaultAddress.base58;
    }
    return null;
}


function isAutoBet(gameIndex) {
    let res = gameIndex === 0 ?
        $('#switch-id').is(':checked') :
        $('#switch-id1').is(':checked');

    log('isAutoBet' + gameIndex, res);
    return res;
}

function onByBet(txId, betAmount, selectedSector, autoBet, gameIndex) {

    log('betAmount', betAmount);

    gtag('event', 'purchase', {
        "transaction_id": txId,
        "value": betAmount,
        "currency": "USD",
        checkout_option: 'tronlink',
        "items": [
            {
                "id": gameIndex === 0 ? ("Bet " + betValue) : ("Bet x" + betValue),
                "name": gameIndex === 0 ? "Dice52" : "Gear of Fortune",
                "quantity": 1,
                "variant": autoBet ? "auto" : "not auto",
                "price": betAmount
            }
        ]
    });
}

function bytes32(...values) {
    const res = values.map(v => {
        const str = tronWeb.toHex(v).substr(2);
        const h = '0x0000000000000000000000000000000000000000000000000000000000000000';
        return h.substr(0, h.length - str.length) + str;
    });
    //log(res);
    return res;
}

function onMint() {
    if (!getTronlinkAddress()) {
        $('#tronLinkModal').modal();
    } else {
        getContract(dividendsControllerAddress, true).then(
            dividendsControllerTronlink => {
                dividendsControllerTronlink.mintTokens().send().then(res => {
                });
            }
        )
    }
}

function onCopyRef() {

    const ref = $('#referralText').val();

    $('#referralText').val(refStart + ref);

    var copyText = document.getElementById("referralText");

    copyText.select();
    document.execCommand("copy");

    $('#referralText').val(ref);
}

function onFreeze() {
    if (!getTronlinkAddress()) {
        $('#tronLinkModal').modal();
    } else {
        getContract(tokenAddress, true).then(
            token => {
                token.balanceOf(getTronlinkAddress()).call().then(balance => {
                    token.approveAndCall(dividendsControllerAddress, balance.toNumber(), '0x0').send().then(res => {
                    });
                });
            }
        )
    }
}

function getParentUserId(ref) {
    /*const parentUser = localStorageGet('parentUser');

    if (parentUser) {
        return post('/api/getParentUserId', parentUser).then(parentUser => {
            return parentUser;
        });
    } else {*/

    if (ref) {
        return getContract(referralsAddress).then(referrrals => {
                return referrrals.getRefToUserId(ref).call().then(userId => {
                    return referrrals.getUserIdToAddress(userId.toNumber()).call().then(parentAddress => {
                        return post('/api/getParentUserId', {
                            ref: ref,
                            userId: userId.toNumber(),
                            parentAddress: this.tronWeb.address.fromHex(parentAddress)
                        }).then(parentUser => {
                            if (parentUser.userId) localStorageSet('parentUser', parentUser);
                            return parentUser;
                        });
                    });
                });
            }
        )
    } else {
        return post('/api/getParentUserId', {}).then(parentUser => {
            //if (parentUser.userId) localStorageSet('parentUser', parentUser);
            return parentUser;
        });
    }
    //}
}

function localStorageGet(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (error) {
        // browser don't support localStorage
        return null;
    }
}

function localStorageSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // browser don't support localStorage
    }
}

function localStorageRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        // browser don't support localStorage
    }
}

function getAddressToRefLink(address) {
    return getContract(referralsAddress).then(
        referrrals => {
            return referrrals.getAddressToUserId(address).call().then(userId => {
                const _userId = userId.toNumber();

                //log('userId', _userId);

                if (_userId) {
                    return referrrals.getUserIdToRef(userId).call().then(ref => {
                        return {ref: ref, userId: _userId};
                    });
                } else {
                    return null;
                }
            });
        }
    )
}

function updateReferralLink() {
    if (getTronlinkAddress()) {
        getAddressToRefLink(getTronlinkAddress()).then(info => {
            if (info) {
                $('#referralText').val(info.ref);

                post('/api/getUserIdRewards', {userId: info.userId}).then(sum => {

                    log('getUserIdRewards', sum);
                    $('#rewardSum').html(sum.toFixed(2) + ' TRX');
                });

            }
        });
    } else {
        setTimeout(updateReferralLink, 3000);
    }
}

function onBuyLink() {
    if (!getTronlinkAddress()) {
        $('#tronLinkModal').modal();
    } else {
        const ref = $('#referralText').val();

        getContract(referralsAddress, true).then(
            referrrals => {
                referrrals.getRefToUserId(ref).call().then(userId => {
                    if (userId.toNumber() || ref.length === 0) {
                        $('#alreadyExistModal').modal();
                    } else {
                        referrrals.buyRef(ref).send({
                            shouldPollResponse: true,
                            callValue: 8880000
                        }).then(() => {
                            updateReferralLink();
                        });
                    }
                });
            }
        )
    }
}

function onUnfreeze() {
    if (!getTronlinkAddress()) {
        $('#tronLinkModal').modal();
    } else {
        getContract(dividendsControllerAddress, true).then(
            dividendsControllerTronlink => {
                dividendsControllerTronlink.unfreezeTokens().send().then(res => {
                });
            }
        )
    }
}

function createBet(gameIndex) {
    const gameAddress = games[gameIndex];

    gtag('event', 'spin', {
        'event_category': 'game'
    });

    if (!getTronlinkAddress()) {
        $('#tronLinkModal').modal();
    } else {

        if (app.myBalance < app.betAmount) {
            $('#noMoneyModal').modal();
        } else {
            setSpinEnable(false);

            createBetStart(gameIndex);

            getContract(gameManagerAddress, true).then(gameManager => {

                app.betValue = gameIndex === 0 ? (app.cardIndex + app.drawRange * 52) : $('#sectorGroup input:radio:checked').val();

                app.betValue32 = bytes32(betValue);

                log('app.drawRange', app.drawRange);
                log('app.cardIndex', app.cardIndex);

                log('app.betValue', app.betValue);
                log('app.betValue32', app.betValue32);
                log('app.betAmount', app.betAmount);
                log('isAutoBet', isAutoBet(gameIndex));


                log(gameAddress + ' ' + getTronlinkAddress() + ' ' + 0 + ' ' + app.betValue32);

                log('gameManager.createBet ' + gameIndex);

                getCurrentBlockNumber().then(blockNumber => {

                    gameManager.createBet(gameAddress, getTronlinkAddress(), app.parentUserId, app.betValue32).send({
                        shouldPollResponse: false,
                        callValue: app.betAmount * 1000000
                    }).then(txId => {
                        app.time0 = (new Date()).getTime();

                        log('txId', txId);

                        onByBet(txId, app.betAmount, app.betValue, isAutoBet(gameIndex), gameIndex);

                        //updateMyBalance();


                        //findTx(txId);

                        findBlockByTxId(blockNumber, blockNumber, txId, gameIndex).then(block => {

                            calcWin(block, gameIndex);

                        });

                        //setTimeout(watchBetTx, 1000, txId, selectedSector, app.betAmount);

                        // setTimeout(watchBetBlockNumber, 1000, lastBetCount.toNumber(), getTronlinkAddress());


                    }).catch(err => {
                        stopBetError('createBet', err, gameIndex);


                    });
                })/*.catch(err => {
                                stopBetError('getCurrentBlockNumber', err);
                            })*/;
            });
        }
    }
}

function calcWin(block, gameIndex) {
    if (!block) return;

    getContract(games[gameIndex]).then(wheel => {

        wheel.getWinIndexFromHash(getTronlinkAddress(), '0x' + block.hash).call().then(winIndexBigNumber => {

            const winIndex = winIndexBigNumber.toNumber();

            let winValue = 0;
            let winAmount = 0;

            if (gameIndex === 0) {
                winValue = cardTypeText(winIndex);

                const betValue = app.betValue;
                const betAmount = app.betAmount;
                const cardsCount = 52;
                const houseEdge = 350;

                if (betValue < cardsCount && betValue < winIndex) {

                    winAmount = betAmount * cardsCount * (10000 - houseEdge) / 10000 / (cardsCount - 1 - betValue);

                } else if (betValue < cardsCount * 2 && (betValue - cardsCount) === winIndex) {

                    winAmount = betAmount * cardsCount * (10000 - houseEdge) / 10000;

                } else if (winIndex < (betValue - cardsCount * 2)) {

                    winAmount = betAmount * cardsCount * (10000 - houseEdge) / 10000 / (betValue - cardsCount * 2);

                    log('betAmount', betAmount);
                    log('cardsCount', cardsCount);
                    log('betValue', betValue);
                    log('winIndex', winIndex);
                    log('winAmount ==========', winAmount);
                }
            } else {

                winValue = app.wheelValues[winIndex];

                winAmount = app.betValue.toString() === winValue.toString() ? (app.betAmount * app.betValue) : 0;

                log('selectedSector', app.betValue);
                log('winValue', winValue);
                log('app.betAmount', app.betAmount);
                log('app.betAmount * app.selectedSector', app.betAmount * app.betValue);
                log('winAmount', winAmount);

            }

            const bet = {
                betValue: app.betValue,
                winIndex: winIndex,
                winValue: winValue,
                winAmount: winAmount
            };
            app.time1 = (new Date()).getTime();


            logLine('win!!!!!!!!!!!!!!  ' + (app.time1 - app.time0), bet);
            //logLine('winBlock', block);

            winBet(bet, gameIndex);
        });
    });
}

function stopBetError(name, err, gameIndex) {
    logError(name, err);

    gameViewState = GameViewState.IDLE;

    if (isAutoBet(gameIndex)) {
        createBet(gameIndex);
    } else {

        setSpinEnable(true);

        resetCard();
        loadCardStop();
    }
}


function watchBetTx(txId, selectedSector, betAmount) {
    getTransactionInfo(txId).then(tx => {
        logJson('tx', tx);

        setTimeout(watchBetTx, 1000, txId, betValue, betAmount);
    });
}

function checkResult(callback, txId, index) {
    if (index === 20) {
        log('Cannot find result in solidity node');
        index = 0;
        //return callback('Cannot find result in solidity node');
    }


    this.tronWeb.trx.getTransactionInfo(txId).then(output => {

        //log('checkResult', output);

        if (!Object.keys(output).length) {
            setTimeout(() => {
                checkResult(callback, txId, index + 1);
            }, 3000);
        } else {

            if (output.result && output.result === 'FAILED') {
                callback(this.tronWeb.toUtf8(output.resMessage));
            } else {
                if (!this.tronWeb.utils.hasProperty(output, 'contractResult')) {
                    callback('Failed to execute: ' + JSON.stringify(output, null, 2));
                } else {

                    return callback(null, output.contractResult[0]);
                }

            }
        }
    });

}

const decodeOutput = (abi, output) => {
    const names = abi.map(({name}) => name).filter(name => !!name);
    const types = abi.map(({type}) => type);

    return tronWeb.utils.abi.decodeParams(names, types, output);
};


function get(url, callback, errorCallback) {
    $.ajax({
        url: url,
        type: 'get',
        success: function (data, textStatus, request) {
            callback(data);
        },
        error: function (request, textStatus, errorThrown) {
            errorCallback("System error");
        }
    });
}


function post(url, data) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: host + url,
            type: 'post',
            headers: {
                'session-key': this.sessionKey,
                'user-address': getTronlinkAddress(),
            },
            contentType: 'application/json',
            data: JSON.stringify(data || {}),
            success: function (data, textStatus, request) {
                if (data.error) {
                    reject(new Error(data.error));
                } else {
                    resolve(data.data);
                }
            },
            error: function (request, textStatus, errorThrown) {
                if (reject) reject(new Error("System error"));
            }
        });
    });
}


function logFormatValue(value, isJson) {
    return (isJson ? JSON.stringify(value, null, 4) : value);
}

function logJson(name, value) {
    log(name, value, true);
}

function log(name, value, isJson) {
    console.log(value !== undefined ? (name + " = " + logFormatValue(value, isJson)) : logFormatValue(name, isJson));
}

function logError(name, value) {
    var message = value !== undefined ? (name + " = " + logFormatValue(value, true)) : logFormatValue(name, true);
    console.error(message);

    gtag('event', 'exception', {
        'description': message,
        'fatal': false   // set to true if the error is fatal
    });
}

function logLine(name, o) {
    if (o)
        console.log(name + ' = ' + JSON.stringify(o));
    else {
        console.log(JSON.stringify(name));
    }
}

//=======================================================================
app.currentGameIndex = 0;

$('.nav-tabs a[href="#gameCards"]').on('shown.bs.tab', function (e) {
    app.currentGameIndex = 0;
    updateTables();
    updateMyHistory();
    updateMyBalance();
});

$('.nav-tabs a[href="#gameGear"]').on('shown.bs.tab', function (e) {
    app.currentGameIndex = 1;
    showWheel();
    updateTables();
    updateMyHistory();
    updateMyBalance();
});


let wheelCreated = false;

function showWheel() {
    createWheelView();
}

var THREE, TWEEN;

function createWheelView() {
    if (wheelCreated) return;

    wheelCreated = true;

    var camera, scene, renderer, controls;
    var settings = {
        metalness: 1,
        roughness: 0.24,
        ambientIntensity: 0.2,
        envMapIntensity: 2,
        displacementScale: 2.436143, // from original model
        normalScale: 1.0,
        lightX: -0.29,
        lightY: 0.58,
        lightZ: -1,
        color: 0x444444,

    };

    var materialWheel;
    var materialTable;

    var pointLight, ambientLight, directionalLight;

    var height = 500; // of camera frustum

    var r = 0.0;

    //  initGui();

    // Init gui
    function initGui() {

        var gui = new dat.GUI();
        //var gui = gui.addFolder( "Material" );
        gui.top = 100;

        gui.add(settings, "metalness").min(0).max(1).onChange(function (value) {

            materialWheel.metalness = value;

        });

        gui.add(settings, "roughness").min(0).max(1).onChange(function (value) {

            materialWheel.roughness = value;

        });


        gui.add(settings, "ambientIntensity").min(0).max(1).onChange(function (value) {

            ambientLight.intensity = value;

        });

        gui.add(settings, "envMapIntensity").min(0).max(3).onChange(function (value) {

            materialWheel.envMapIntensity = value;


        });

        gui.add(settings, "lightX").min(-1).max(1).onChange(function (value) {
            directionalLight.position.x = value;
        });
        gui.add(settings, "lightY").min(-1).max(1).onChange(function (value) {
            directionalLight.position.y = value;
        });
        gui.add(settings, "lightZ").min(-1).max(1).onChange(function (value) {
            directionalLight.position.z = value;
        });

        gui.addColor(settings, "color").onChange(function (value) {
            materialWheel.color.set(value);
        });

    }

    function initMaterial() {
        var matcap = new THREE.TextureLoader().load("img/3.jpg");
        var map = new THREE.TextureLoader().load("img/wheelColor.png");
        var mapTable = new THREE.TextureLoader().load("img/table.png");
        //  map.encoding = THREE.sRGBEncoding;

        materialWheel = new THREE.MeshMatcapMaterial({
            color: 0xFFFFFF,
            matcap: matcap,
            map: map,
        });

        materialTable = new THREE.MeshMatcapMaterial({
            color: 0xFFFFFF,
            matcap: matcap,
            map: mapTable,
        });
    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);


    camera.rotateX(THREE.Math.degToRad(-90));
    camera.rotateX(THREE.Math.degToRad(30));

    camera.position.set(0, 50, 29);

    // var controls = new THREE.OrbitControls(camera);

    //var renderer = new THREE.WebGLRenderer({ alpha: true } );
    var renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio || 1);

    var canvas = $('#treeCanvas3D');

    window.addEventListener('resize', onResize, false);

    function onResize() {
        log('canvas', canvas.width() + " " + canvas.height());

        camera.aspect = canvas.width() / canvas.height();
        camera.updateProjectionMatrix();

        renderer.setSize(canvas.width(), canvas.height());

        var pixelRatio = renderer.getPixelRatio(),
            newWidth = Math.floor(canvas.width() * pixelRatio) || 1,
            newHeight = Math.floor(canvas.height() * pixelRatio) || 1;


        if (composer) composer.setSize(newWidth, newHeight);
        if (occlusionComposer) occlusionComposer.setSize(newWidth * renderScale, newHeight * renderScale);
    }

    var sectors = [];
    var textMaterialBlack;
    var textMaterialLight;
    var textMaterialLight2;

    function selectSector(i, value) {
        sectors[i].material = value ? textMaterialLight : textMaterialBlack;
        //  sectors[i].layers.set(value ? OCCLUSION_LAYER : DEFAULT_LAYER);
    }

    var winValueText;
    var winText;

    app.createWinValueText = function (str) {
        if (winValueText) {
            winValueText.geometry.dispose();
            winValueText.geometry = createGeometryText(str, 2.2);
        } else {
            winValueText = createFloorText(str, 2.2, 4);
        }
    };

    function createWinText() {
        winText = createFloorText('WIN', 2.7, -4.5);
    }

    function createFloorText(str, size, pos) {

        var textGeometry = createGeometryText(str, size);

        var textMesh = new THREE.Mesh(textGeometry, textMaterialLight);
        textMesh.rotateX(THREE.Math.degToRad(90));
        textMesh.rotateZ(THREE.Math.degToRad(90));

        textMesh.position.y = -3;
        textMesh.position.x = pos;


        floorMesh.add(textMesh);

        //textMesh.layers.set(OCCLUSION_LAYER);

        return textMesh;
    }

    function createGeometryText(str, size) {

        var textGeometry = new THREE.TextGeometry(str.toString(), {
            font: textFont,
            size: size,
            height: 0.1,
            curveSegments: 12,
        });
        textGeometry.center();

        log("createGeometryText")

        return textGeometry;
    }


    var textFont;

    function initSectorsTexts(callback) {
        var fontLoader = new THREE.FontLoader();

        fontLoader.load('fonts/optimer_bold.typeface.json', function (font) {
            textFont = font;

            var sectorTexts = ['x0', 'x6', 'x2', 'x5', 'x2', 'x10', 'x2', 'x5', 'x2', 'x6', 'x2', 'x5', 'x2', 'x6',
                'x2', 'x10', 'x2', 'x5', 'x2', 'x20', 'x2'];

            textMaterialBlack = new THREE.MeshBasicMaterial({color: 0x000000});
            textMaterialLight = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
            textMaterialLight2 = new THREE.MeshBasicMaterial({color: 0xffffd8});

            for (var i = 0; i < sectorTexts.length; i++) {

                let s = sectorTexts[i];
                //.replace('x','');
//                    size: s.length === 2?  1.7: 1.9,
                var textGeometry = new THREE.TextGeometry(s, {
                    font: font,
                    size: s.length === 3 ? 1.4 : 1.6,
                    height: 0.1,
                    curveSegments: 12,
//                weight: "regular",
                    bevelEnabled: false,
                    bevelThickness: 1,
                    bevelSize: 0.5,
                    bevelSegments: 3
                });
                textGeometry.center();

                var label = new THREE.Mesh(textGeometry, textMaterialBlack);
                //   label.layers.set(OCCLUSION_LAYER);
                label.rotateZ(THREE.Math.degToRad(180));

                label.position.y = 14.8;

                var sectorPivot = new THREE.Object3D();
                wheelMesh.add(sectorPivot);
                sectorPivot.position.y = 1.5;
                sectorPivot.rotateX(THREE.Math.degToRad(-90));
                sectorPivot.rotateZ(THREE.Math.degToRad(-360 / 21 * i + 90));

                sectorPivot.add(label);
                sectors.push(label)

            }

            if (callback) callback();

        });

    }


    onResize();

    canvas.append(renderer.domElement);

    initMaterial();
//================================================================================
    THREE.VolumetericLightShader = {
        uniforms: {
            /*tDiffuse: {value: null},
            lightPosition: {value: new THREE.Vector2(0.5, 0.5)},
            exposure: {value: 0.18},
            decay: {value: 0.95},
            density: {value: 0.8},
            weight: {value: 0.4},
            samples: {value: 50}*/
            tDiffuse: {value: null},
            lightPosition: {value: new THREE.Vector2(0.5, 0.3310514816529751)},
            exposure: {value: 0.35},
            decay: {value: 0.865},
            density: {value: 0.67},
            weight: {value: 0.4},
            samples: {value: 50}
        },

        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),

        fragmentShader: [
            "varying vec2 vUv;",
            "uniform sampler2D tDiffuse;",
            "uniform vec2 lightPosition;",
            "uniform float exposure;",
            "uniform float decay;",
            "uniform float density;",
            "uniform float weight;",
            "uniform int samples;",
            "const int MAX_SAMPLES = 100;",
            "void main()",
            "{",
            "vec2 texCoord = vUv;",
            "vec2 deltaTextCoord = texCoord - lightPosition;",
            "deltaTextCoord *= 1.0 / float(samples) * density;",
            "vec4 color = texture2D(tDiffuse, texCoord);",
            "float illuminationDecay = 1.0;",
            "for(int i=0; i < MAX_SAMPLES; i++)",
            "{",
            "if(i == samples){",
            "break;",
            "}",
            "texCoord -= deltaTextCoord;",
            "vec4 sample = texture2D(tDiffuse, texCoord);",
            "sample *= illuminationDecay * weight;",
            "color += sample;",
            "illuminationDecay *= decay;",
            "}",
            "gl_FragColor = color * exposure;",
            "}"
        ].join("\n")
    };

    THREE.AdditiveBlendingShader = {
        uniforms: {
            tDiffuse: {value: null},
            tAdd: {value: null}
        },

        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform sampler2D tDiffuse;",
            "uniform sampler2D tAdd;",
            "varying vec2 vUv;",
            "void main() {",
            "vec4 color = texture2D( tDiffuse, vUv );",
            "vec4 add = texture2D( tAdd, vUv );",
            "gl_FragColor = color + add;",
            "}"
        ].join("\n")
    };

    THREE.PassThroughShader = {
        uniforms: {
            tDiffuse: {value: null}
        },

        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform sampler2D tDiffuse;",
            "varying vec2 vUv;",
            "void main() {",
            "gl_FragColor = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );",
            "}"
        ].join("\n")
    };

    var composer, material0,
        occlusionComposer, occlusionRenderTarget, lightSphere,
        volumetericLightShaderUniforms,
        DEFAULT_LAYER = 0,
        OCCLUSION_LAYER = 1,
        renderScale = 1,
        fxaaPass,
        angle = 0;


    function updateShaderLight() {
        var p = lightSphere.position.clone(),
            vector = p.project(camera),
            x = (vector.x + 1) / 2,
            y = (vector.y + 1) / 2;

        console.log(y);
        volumetericLightShaderUniforms.lightPosition.value.set(x, y);
        pointLight.position.copy(lightSphere.position);
    };

    function setupScene() {
        var
            geometry,
            material;

        pointLight = new THREE.PointLight(0xffffff);
        //scene.add(pointLight);

        // geometry = new THREE.SphereBufferGeometry(20, 10, 10);
        var c = 150;
        geometry = new THREE.CubeGeometry(c, 1, c, 1, 1, 1);
        material = new THREE.MeshBasicMaterial({color: 0xffffff});
        lightSphere = new THREE.Mesh(geometry, material);
        lightSphere.position.y = -16;

        lightSphere.layers.set(OCCLUSION_LAYER);
        scene.add(lightSphere);

        material0 = new THREE.MeshBasicMaterial({color: 0x000000});

    }

    function setupPostprocessing() {
        var pass;

        var w = canvas.width();
        var h = canvas.height();

        var pixelRatio = window.devicePixelRatio || 1;

        occlusionRenderTarget = new THREE.WebGLRenderTarget(w * renderScale, h * renderScale);
        occlusionComposer = new THREE.EffectComposer(renderer, occlusionRenderTarget);
        occlusionComposer.addPass(new THREE.RenderPass(scene, camera));

        pass = new THREE.ShaderPass(THREE.VolumetericLightShader);
        pass.needsSwap = false;
        occlusionComposer.addPass(pass);
        volumetericLightShaderUniforms = pass.uniforms;

        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
        composer.addPass(fxaaPass);
        fxaaPass.renderToScreen = false;
        fxaaPass.uniforms.resolution.value.set(1 / w / pixelRatio, 1 / h / pixelRatio);

        pass = new THREE.ShaderPass(THREE.AdditiveBlendingShader);
        pass.uniforms.tAdd.value = occlusionRenderTarget.texture;
        composer.addPass(pass);
        pass.renderToScreen = true;


    }

    function setupGUI() {
        var folder,
            min,
            max,
            step;


        folder = gui.addFolder('Light Position');
        folder.add(lightSphere.position, 'x').min(-10).max(10).step(0.1).onChange(updateShaderLight);
        folder.add(lightSphere.position, 'y').min(-50).max(10).step(0.1).onChange(updateShaderLight);
        folder.add(lightSphere.position, 'z').min(-50).max(50).step(0.1).onChange(updateShaderLight);
        folder.open();

        folder = gui.addFolder('Volumeteric Light Shader');
        Object.keys(volumetericLightShaderUniforms).forEach(function (key) {
            if (key !== 'tDiffuse' && key != 'lightPosition') {
                prop = volumetericLightShaderUniforms[key];

                switch (key) {
                    case 'exposure':
                        min = 0;
                        max = 1;
                        step = 0.01;
                        break;
                    case 'decay':
                        min = 0.8;
                        max = 1;
                        step = 0.001;
                        break;
                    case 'density':
                        min = 0;
                        max = 1;
                        step = 0.01;
                        break;
                    case 'weight':
                        min = 0;
                        max = 1;
                        step = 0.01;
                        break;
                    case 'samples':
                        min = 1;
                        max = 100;
                        step = 1.0;
                        break;
                }

                folder.add(prop, 'value').min(min).max(max).step(step).name(key);
            }
        });
        folder.open();

        folder.addColor(pointLight, "color").onChange(function (value) {
            pointLight.color = (value);
        });
    }

    function addRenderTargetImage() {
        var material,
            mesh,
            folder;

        material = new THREE.ShaderMaterial(THREE.PassThroughShader);
        material.uniforms.tDiffuse.value = occlusionRenderTarget.texture;

        mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
        composer.passes[1].scene.add(mesh);
        mesh.visible = false;

        /*folder = gui.addFolder('Light Pass Render Image');
        folder.add(mesh, 'visible');
        folder.add({scale: 0.5}, 'scale', {Full: 1, Half: 0.5, Quarter: 0.25})
            .onChange(function (value) {
                renderScale = value;
                window.dispatchEvent(new Event('resize'));
            });
        folder.open();*/

    }

    setupScene();
    setupPostprocessing();
    //     setupGUI();
    addRenderTargetImage();

//==========

    var shadowMeshes;
    var wheelGroup;
    var wheelMesh;
    var floorMesh;
    var arrowMesh;

    var gearBig0Mesh;
    var gearBig1Mesh;
    var gearBig2Mesh;

    var gearRingMesh;
    var gearRingBottomMesh;
    var tron0Mesh;
    var tron1Mesh;
    var tron2Mesh;
    var gearSunMesh;
    var planeMesh;
    var baseMesh;
    var materialPlane;

    const loader = new THREE.FBXLoader();
    loader.load('models/wheel.fbx', model => {
        scene.add(model);

        model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;

                if (child.name !== 'plane' && child.name !== 'base' && child.name !== 'wheel')
                    child.material = materialWheel;
            }
        });

        planeMesh = model.getObjectByName('plane');
        baseMesh = model.getObjectByName('base');

        materialPlane = planeMesh.material;

        wheelMesh = model.getObjectByName('wheel');

        gearBig0Mesh = model.getObjectByName('gearBig0');
        gearBig1Mesh = model.getObjectByName('gearBig1');
        gearBig2Mesh = model.getObjectByName('gearBig2');


        wheelGroup = model.getObjectByName('wheelGroup');
        gearRingMesh = model.getObjectByName('gearRing');
        gearRingBottomMesh = model.getObjectByName('gearRingBottom');
        tron0Mesh = model.getObjectByName('tron0');
        tron1Mesh = model.getObjectByName('tron1');
        tron2Mesh = model.getObjectByName('tron2');
        gearSunMesh = model.getObjectByName('gearSun');
        floorMesh = model.getObjectByName('floor');
        arrowMesh = model.getObjectByName('arrow');

        app.arrowMesh = arrowMesh;

        //   gearRingMesh.parent.remove(gearRingMesh);
        //   gearRingBottomMesh.parent.remove(gearRingBottomMesh);

        console.log(model);

        model.rotateY(THREE.Math.degToRad(90));

        shadowMeshes = [
            wheelMesh, gearBig0Mesh, gearBig1Mesh, gearBig2Mesh, gearRingMesh,
            tron0Mesh, tron1Mesh, tron2Mesh, gearSunMesh, planeMesh, baseMesh, gearRingBottomMesh, floorMesh, arrowMesh
        ];

        initSectorsTexts(() => {
            createWinText();
        });
    });

    // lights

    ambientLight = new THREE.AmbientLight(0xffffff, settings.ambientIntensity);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(settings.lightX, settings.lightY, settings.lightZ).normalize();
    // scene.add(directionalLight);

    app.wheelRotation = 0;
    app.wheelGroupRotation = 0;
    app.wheelFloorRotation = 0;

    app.lastTime = (new Date()).getTime();

    var update = function () {
        const time = (new Date()).getTime();
        const dTime = time - app.lastTime;
        const speed = dTime / 17;
        app.lastTime = time;


        switch (gameViewState) {
            case GameViewState.IDLE:
                app.wheelRotation -= 0.1 * speed;
                app.wheelGroupRotation -= 0.1 * speed;
                break;
            case GameViewState.BET:
                app.wheelRotation -= 2 * speed;
                app.wheelGroupRotation -= 2 * speed;
                break;
            case GameViewState.WIN:
                app.wheelGroupRotation -= speed;
                break;
            case GameViewState.WIN_IDLE:
                app.wheelGroupRotation -= 0.1 * speed;
                break;
        }

        var r = THREE.Math.degToRad(app.wheelRotation);

        if (gameViewState !== GameViewState.WIN_IDLE) {

            var selectedIndex = (Math.round(app.wheelRotation / (360 / 21)) % 21);

            if (selectedIndex < 0) selectedIndex += 21;

            for (let i = 0; i < sectors.length; i++) {
                selectSector(i, i === selectedIndex);
            }
            wheelMesh.rotation.y = r;

        }

        wheelGroup.rotation.y = THREE.Math.degToRad(app.wheelGroupRotation);
        gearRingMesh.rotation.y = r * 360 / -560;

        gearBig0Mesh.rotation.y = r * 864 / -560;
        gearBig1Mesh.rotation.y = r * 864 / -560;
        gearBig2Mesh.rotation.y = r * 864 / -560;

        gearSunMesh.rotation.y = r * -1440 / -560;

        wheelGroup.rotation.z = THREE.Math.degToRad(app.wheelFloorRotation);
        //  floorMesh.rotation.z = THREE.Math.degToRad(app.wheelFloorRotation);

    };

    var render = function () {
        requestAnimationFrame(render);

        if (!wheelMesh) return;


        update();

        //renderer.render(scene, camera);

        shadowMeshes.forEach(mesh => {
            mesh.material = material0;
            mesh.layers.set(OCCLUSION_LAYER)
        });

        camera.layers.set(OCCLUSION_LAYER);
        renderer.setClearColor(0x000000);
        occlusionComposer.render();

        shadowMeshes.forEach(mesh => {
            mesh.material = materialWheel;
            mesh.layers.set(DEFAULT_LAYER)
        });
        planeMesh.material = materialTable;
        //   baseMesh.material = materialPlane;
        // wheelMesh.material = materialPlane;
        //  gearRingBottomMesh.material = materialPlane;

        camera.layers.set(DEFAULT_LAYER);
        renderer.setClearColor(0x090611);
        composer.render();
    };

    render();


    var mouse = {x: 0, y: 0};

    function mouseMove(e) {
        var speed = 0.1;

        camera.position.x += Math.max(Math.min((e.clientX - mouse.x) * 0.01, speed), -speed);
        camera.position.y += Math.max(Math.min((mouse.y - e.clientY) * 0.01, speed), -speed);

        mouse.x = e.clientX;
        mouse.y = e.clientY;

    }

    //window.addEventListener('mousemove', mouseMove);
};