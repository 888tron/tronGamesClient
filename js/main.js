const wheelAddress = 'TQ1tETQGm53WPBFiju7qg74eJEgfQKZxAa';
const betsAddress = 'TWG2gcm39isT5t9WZTSHZHYNuahy8f6Rjj';

const host = 'https://888tron.com';
//const host = 'http://localhost:3000';

const app = this;

app.minBet = 10;
app.maxBet = 1000;
app.betAmount = minBet;

const GameState = {
    IDLE: 1,
    BET: 2,
    WIN: 3,
    WIN_IDLE: 4,
};

var gameState = GameState.IDLE;


/*const fullNode = new HttpProvider('https://api.shasta.trongrid.io');
const solidityNode = new HttpProvider('https://api.shasta.trongrid.io');
const eventServer = 'https://api.shasta.trongrid.io/';*/

const fullNode = 'https://api.trongrid.io';
const solidityNode = fullNode;
const eventServer = fullNode;

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
    const HttpProvider = TronWeb.providers.HttpProvider;

    app.tronWeb2 = new TronWeb(
        new HttpProvider(fullNode),
        new HttpProvider(solidityNode),
        eventServer,
        'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0');
    //  'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0');

    //app.tronWeb2.setDefaultBlock('latest');

    if (isTronlinkLogin()) {

        log('tronlink', this.tronWeb.defaultAddress.base58);

        gtag('config', 'GA_TRACKING_ID', {
            'user_id': this.tronWeb.defaultAddress.base58
        });

        getTronlinkContract();
    }

    start();

};

function getTronlinkContract() {
    return this.contract ? Promise.resolve(this.contract) : this.tronWeb.contract().at(wheelAddress).then(res => {
        this.contract = res;
        return Promise.resolve(this.contract);
    });
}

function updateMyBalance() {
    if (isTronlinkLogin()) {
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

function updateData() {
    log("getTotalBetWin");
    return app.contract2.getTotalBetWin().call().then(getTotalBetWin => {

        app.betCount = getTotalBetWin.betCountClosed.toNumber();

        log(' betSum = ' + (getTotalBetWin.betSum.toNumber() / 1000000) +
            ' winSum = ' + (getTotalBetWin.winSum.toNumber() / 1000000) +
            ' betCountClosed = ' + app.betCount +
            ' betCount = ' + getTotalBetWin.betCount.toNumber()
        );

        $('.betsCount').html(app.betCount.toString());

        $('.totalWon').html(trx(getTotalBetWin.winSum.toNumber()));

    })
        .catch(err => {
            logError(err);
            return updateData();
        });
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

    if (value < app.minBet) value = app.minBet;
    if (value > app.maxBet) value = app.maxBet;
    if (value > app.myBalance) value = app.myBalance;

    log('validateBetAmount ' + value);

    $('#betAmount').val(value);

    log('app.betAmount', app.betAmount);
    app.betAmount = value;

}

function addressToShort(address) {
    return address.substr(0, 5) + "...." + address.substr(address.length - 5, 5);
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

function updateTables() {
    setTableData($('#mainTable > tbody:last'), app.betsAll.filter(isMyBet));
    setTableData($('#allTable > tbody:last'), app.betsAll);

    setTableData($('#highTable > tbody:last'), app.betsAll.filter(bet => {
        return bet.winAmount > 0 && bet.amount > 100;
    }));

    setTableData($('#rareTable > tbody:last'), app.betsAll.filter(bet => {
        return bet.winAmount > 0 && bet.winValue >= 10;
    }));

    const newTotalWon = (app.betsAll.reduce((a, b) => {
        return a + b.winAmount;
    }, 0));

    const newTotalBetAmount = (app.betsAll.reduce((a, b) => {
        return a + b.amount;
    }, 0));

    log('TotalBetAmount', newTotalBetAmount);

    const newBetCount = app.betsAll.length;

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
    return isTronlinkLogin() && bet.player === this.tronWeb.defaultAddress.base58;
}

function setTableData(table, data) {

    const n = Math.min(data.length, 50);

    var rows = '';

    for (var i = 0; i < n; i++) {
        var bet = data[i];

        //  if (bet.winValue < 21) {
        rows +=
            '<tr>' +
            td(timeToString(bet.time)) +
            // td(bet.id) +
            td(bet.blockNumber) +
            td(addressToShort(bet.player)) +
            td('x' + bet.betValue) +
            td((bet.winValue < 21 ? ('x' + bet.winValue) : '-')) +
            td(bet.amount + ' TRX') +
            td(bet.winAmount + ' TRX') +
            '</tr>';
        //  }
    }

    table.html(rows);

}

function updateTop() {
    const topMap = {};

    app.betsAll.forEach(bet => {
        if (!topMap[bet.player]) {
            topMap[bet.player] = bet.amount;
        } else {
            topMap[bet.player] += bet.amount;
        }
    });


    let topList = Object.keys(topMap).map(key => {
        return {
            player: key,
            sum: topMap[key]
        }
    }).sort((a, b) => b.sum - a.sum);

    setSideTableData($('#sideTable > tbody:last'), topList);
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

function setHistoryTableData(table, data) {
    const n = Math.min(data.length, 24);

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
    var betId = $('#betId').val();
    var blocknumber = $('#blocknumber').val();

    if (betId && blocknumber) {
        app.contract2.getWinValue(betId, blocknumber).call().then(res => {

            log('getWinValue', res)
            $('#randomResult').html(res.toString() === '100' ? 'Please use last 250 blocks for check' : res.toString());
        })
    }
}

function setSpinEnable(value) {
    $('#spinButton').prop("disabled", !value);
}

var isLoaded = false;

function onLoadComplete() {
    if (!isLoaded) {
        isLoaded = true;
        $('#myHeader').addClass('fixed-top');
        $('#before-load').find('i').fadeOut().end().delay(200).fadeOut('slow');
    }
}

function getTransactionInfo(transactionID, callback) {

    this.tronWeb.solidityNode.request('walletsolidity/gettransactioninfobyid', {
        value: transactionID
    }, 'post').then(transaction => {
        callback(null, transaction);
    }).catch(err => callback(err));
}

function start() {

    $('#betAmount').focusout(() => setBetAmount($('#betAmount').val()));

    $('#spinButton').click(() => {
        createBet();
    });


    app.tronWeb2.contract().at(wheelAddress).then(res => {
        app.contract2 = res;

        console.log("contractAddress = " + wheelAddress);


        /* log('bets ===========');
         app.contract2.getPlayerBets('TQCesZGRjuxiMwdPvTaPQdFEpDSMTjM7jS', 0, 1000000).call().then(bets => {
            log('bets ===========', bets, true);

            log('',app.tronWeb2.address.fromHex(bets.playerBets[1]));
         });*/


        log(app.contract2);


        /*app.contract2.getMinMaxBet().call().then(minMaxBet => {
            app.minBet = minMaxBet.min / 1000000;
            app.maxBet = minMaxBet.max / 1000000;

            log('minBet', app.minBet);
            log('maxBet', app.maxBet);

            setBetMin();
        });*/

        app.minBet = 10;
        app.maxBet = 1000;

        log('minBet', app.minBet);
        log('maxBet', app.maxBet);

        setBetMin();

        //updateData().then(getLastBets);

        getLastBets();

        updateMyBalance();
        updateTop();


        /*get("https://api.shasta.trongrid.io/event/contract/"+contractAddress+"/", res => {
            console.log(res);
        });*/


    }, err => {
        logError("contractAt", err)
    });

}

app.betsAll = [];
app.betsCount = 0;
app.totalWon = 0;

function getLastBets() {
    /*    app.tronWeb2.contract().at('TJwZHmmaKngYEXCPhH5G5a9mixrWE5MPZR').then(res => {
            res.bets().call().then(bet => {
                log('bet', bet);
            })
        });*/


    return get(host + '/bets?offset=' + app.betsAll.length, data => {

            app.betsAll = data.reverse().concat(app.betsAll);

            // logLine('data', data);

            const myBet = data.find(isMyBet);
            if (myBet) {
                log('mybet!');
                if (gameState !== GameState.BET) {
                    updateHistoryTable();
                } else {
                    winBet(myBet);
                }

            }


            //readBets(['0x0000000000000000000000000000000000000000000000000000000000000002','0x000001000001e600000e0002928c9af0651632157ef27a2cf17ca72c575a4d21']);

            /*app.tronWeb2.trx.getTransaction('512cf5046c35447196496e2060f03ddd3b867d4e356f5cda0133faf3de22006b').then(tx => {
                console.log(tx);
            });*/

            if (data.length) {
                updateTables();
                //updateData();

                updateTop();
            }

            setTimeout(getLastBets, 1000);

            //if (app.lastBetIndex === app.betCount) {
            onLoadComplete();
            //}

        },
        err => {
            setTimeout(getLastBets, 1000);
        }
    )
}


function readBets(res) {
    //log('res', res);

    var i = 0;

    var bets = [];
    while (i < res.length) {
        var betData0 = res[i++];
        var betData1 = res[i++];

        const bet = {
            id: app.tronWeb2.toBigNumber('0x' + betData0.substr(betData0.length - 8, 8)).toNumber(),
            player: app.tronWeb2.address.fromHex('41' + betData1.substr(betData1.length - 40)),
            value: app.tronWeb2.toBigNumber('0x' + betData1.substr(betData1.length - 42, 2)).toNumber(),
            winIndex: app.tronWeb2.toBigNumber('0x' + betData1.substr(betData1.length - 44, 2)).toNumber(),
            amount: app.tronWeb2.toBigNumber('0x' + betData1.substr(betData1.length - 50, 6)).toNumber(),
            blockNumber: app.tronWeb2.toBigNumber('0x' + betData1.substr(betData1.length - 58, 8)).toNumber(),
            ref: app.tronWeb2.toBigNumber('0x' + betData1.substr(betData1.length - 64, 6)).toNumber(),
        };

        bet.winValue = [0, 6, 2, 5, 2, 10, 2, 5, 2, 6, 2, 5, 2, 6, 2, 10, 2, 5, 2, 20, 2][bet.winIndex];
        bet.winAmount = 0;

        if (bet.winIndex < 100) {
            bet.winAmount = bet.value === bet.winValue ? (bet.amount * bet.value) : 0;
        } else if (bet.winIndex > 100) {
            bet.winAmount = bet.amount;
        }

        //console.log(bet);

        bets.push(bet);
    }
    return bets;
}


function createBetStart() {
    console.log('createBetStart');

    setSpinEnable(false);

    //bet.winValue;

    //bet.winAmount;

    if (gameState === GameState.WIN_IDLE) {


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
                                gameState = GameState.BET;
                            })
                            .start();

                    })
                    .start();
            }).start();

    } else {
        gameState = GameState.BET;

    }
}


function betErrorStop(err) {
    console.log('betErrorStop');

    console.error(err);

    gameState = GameState.IDLE;
}

function updateHistoryTable() {
    setHistoryTableData($('.history-table > div:last'), app.betsAll.filter(isMyBet));
}

function winBet(bet) {

    log('winValue', bet.winValue);
    log('winIndex', bet.winIndex);

    gameState = GameState.WIN;

    app.wheelRotation %= 360;


    var targetRotation = -360 * 1 + (360 / 21 * bet.winIndex);
    if (targetRotation > app.wheelRotation) targetRotation -= 360;

    log('app.wheelRotation', app.wheelRotation);
    log('targetRotation', targetRotation);


    new TWEEN.Tween(app)
        .to({wheelRotation: targetRotation}, 4000)
        .easing(myEasing)
        .onComplete(() => {
            gameState = GameState.WIN_IDLE;

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
                                    setSpinEnable(true);
                                })
                                .start();

                            updateMyBalance();
                            updateHistoryTable();

                            if (isAutoBet()) createBet();
                        })
                        .start();

                }).start();


        })
        .start();

}

function myEasing(k) {
    var t = (k * 100); // add this
    var d = 100; // add this

    var ts = (t /= d) * t;
    var tc = ts * t;
    return (14.495 * tc * ts + -41.9825 * ts * ts + 44.18 * tc + -21.19 * ts + 5.4975 * t);
}

function isTronlinkLogin() {
    if (this.tronWeb && this.tronWeb.defaultAddress && this.tronWeb.defaultAddress.base58) {

        //log('tronlink', this.tronWeb.defaultAddress.base58);

        return true;
    }
    return false;
}

function setBonusWallets() {
    this.contract.setBonusWallets(['TGHL59JTiiRQh6P378cn8h8yRbCwNQ2mVx'], [100]).send({
        shouldPollResponse: true
    }).then(res => {
        log('setBonusWallets', res);
    });
}


function isWorking(callback) {
    callback(true);
}

function isAutoBet() {
    return $('#switch-id').is(':checked');
}

function onByBet(txId, betAmount, selectedSector, autoBet) {

    log('betAmount', betAmount);

    gtag('event', 'purchase', {
        "transaction_id": txId,
        //"affiliation": "Google online store",
        "value": betAmount,
        "currency": "USD",
        //"tax": 1.24,
        //"shipping": 0,
        checkout_option: 'tronlink',
        "items": [
            {
                "id": "Bet x" + selectedSector,
                "name": "Gear of Fortune",
                "quantity": 1,
                "variant": autoBet ? "auto" : "not auto",
                "price": betAmount
            }
        ]
    });
}

function createBet() {

    console.log('createBet');

    gtag('event', 'spin', {
        'event_category': 'game'
    });

    if (!isTronlinkLogin()) {
        $('#tronLinkModal').modal();
    } else {

        getTronlinkContract().then(contract => {

            app.selectedSector = $('#sectorGroup input:radio:checked').val();

            log('selectedSector', selectedSector);
            log('app.betAmount', app.betAmount);
            log('isAutoBet', isAutoBet());

            isWorking(isWorkingRes => {
                    if (isWorkingRes) {
                        contract.createBet(app.selectedSector, 0).send({
                            shouldPollResponse: false,
                            callValue: app.betAmount * 1000000
                        }).then(txId => {
                            this.lastBetHash = txId;

                            onByBet(txId, app.betAmount, selectedSector, isAutoBet());

                            console.log(txId);
                            createBetStart();

                            checkResult((err, res) => {
                                if (err) {
                                    betErrorStop(err);
                                } else {
                                    console.log(res);
                                }
                            }, this.lastBetHash, 0);

                        }, err => {
                            console.log(err);
                        })
                    } else {
                        $('#isNotWorkingModal').modal();
                    }
                }
            );

        });
    }
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

function post(url, data, callback, onError) {
    $.ajax({
        url: url,
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data, textStatus, request) {
            const res = JSON.parse(data);
            //console.log(res);
            callback(res);
        },

        error: function (request, textStatus, errorThrown) {
            if (onError) onError("System error");
        }
    });
}


function logFormatValue(value, isJson) {
    return (isJson ? JSON.stringify(value, null, 4) : value);
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
        if (_.isArray(name))
            name.forEach(item => {
                console.log(JSON.stringify(item));
            });
        else
            console.log(JSON.stringify(name));
    }
}

//=======================================================================

var THREE, TWEEN;


$(function () {


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

    var canvas = $('#treeCanvas3D');

    window.addEventListener('resize', onResize, false);

    function onResize() {

        camera.aspect = canvas.width() / canvas.height();
        camera.updateProjectionMatrix();

        renderer.setSize(canvas.width(), canvas.height());

        var pixelRatio = renderer.getPixelRatio(),
            newWidth = Math.floor(canvas.width() / pixelRatio) || 1,
            newHeight = Math.floor(canvas.height() / pixelRatio) || 1;

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

        occlusionRenderTarget = new THREE.WebGLRenderTarget(w * renderScale, h * renderScale);
        occlusionComposer = new THREE.EffectComposer(renderer, occlusionRenderTarget);
        occlusionComposer.addPass(new THREE.RenderPass(scene, camera));

        pass = new THREE.ShaderPass(THREE.VolumetericLightShader);
        pass.needsSwap = false;
        occlusionComposer.addPass(pass);
        volumetericLightShaderUniforms = pass.uniforms;

        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        var shaderPass = new THREE.ShaderPass(THREE.FXAAShader);
        composer.addPass(shaderPass);
        shaderPass.renderToScreen = false;
        shaderPass.uniforms.resolution.value.set(1 / w, 1 / h);

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


    var update = function () {
        switch (gameState) {
            case GameState.IDLE:
                app.wheelRotation -= 0.1;
                app.wheelGroupRotation -= 0.1;
                break;
            case GameState.BET:
                app.wheelRotation -= 2;
                app.wheelGroupRotation -= 2;
                break;
            case GameState.WIN:
                app.wheelGroupRotation -= 1;
                break;
            case GameState.WIN_IDLE:
                app.wheelGroupRotation -= 0.1;
                break;
        }

        var r = THREE.Math.degToRad(app.wheelRotation);

        if (gameState !== GameState.WIN_IDLE) {

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

        TWEEN.update();
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
})