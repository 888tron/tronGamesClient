var localeVer = '5.9';

var dictionary = {};

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

function insertUrlVar(key, value) {
    key = encodeURI(key);
    value = encodeURI(value);
    var pairs = document.location.search.substr(1).split('&');
    var i = pairs.length;
    while (i--) {
        var arr = pairs[i].split('=');
        if (arr[0] == key) {
            arr[1] = value;
            pairs[i] = arr.join('=');
            break;
        }
    }
    if (i < 0) {
        pairs[pairs.length] = key + '=' + value;
    }
    document.location.search = pairs.join('&');
}

function updateLanguage(lang) {
    insertUrlVar('lang', lang);
}

function localize(lang, dictionary) {
	
    switch (lang) {
        case 'ru':
            $('#whitepaperLink').attr('href', 'wp/888Tron_ru.pdf');
			$('.tgLink').attr('href', 'https://t.me/Tron888rus');
            break;
		case 'de':
			$('.tgLink').attr('href', 'https://t.me/tron888');
            break;
        case 'es':
            $('#whitepaperLink').attr('href', 'wp/888Tron_es.pdf');
			$('.tgLink').attr('href', 'https://t.me/tron888');
            break;
		case 'ch':
            $('#whitepaperLink').attr('href', 'wp/888Tron_ch.pdf');
			$('.tgLink').attr('href', 'https://t.me/tron888_ch');
            break;
		case 'kr':
            $('#whitepaperLink').attr('href', 'wp/888Tron_kr.pdf');
			$('.tgLink').attr('href', 'https://t.me/tron888_kor');
            break;
		case 'tr':
            $('#whitepaperLink').attr('href', 'wp/888Tron_tr.pdf');
			$('.tgLink').attr('href', 'https://t.me/tron888');
            break;
        }
    
    //document.getElementById('localeIndicator').innerHTML = lang.toUpperCase();
    var CurentLang = 'img/flags/' + lang.toLowerCase() + '.svg';
    $(document).find('.curent-lang').attr('src', CurentLang);

    var elements = [].slice.call(document.querySelectorAll('[data-locale]'));
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-locale');
        if (dictionary[key]) {
            elements[i].innerHTML = dictionary[key];
        } else {
            console.error('No locale for ' + key);
        }
    }

    var elements = [].slice.call(document.querySelectorAll('[data-locale-placeholder]'));
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-locale-placeholder');
        if (dictionary[key]) {
            elements[i].placeholder = dictionary[key];
        } else {
            console.error('No locale for ' + key);
        }
    }

    var elements = [].slice.call(document.querySelectorAll('[data-locale-title]'));
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-locale-title');
        if (dictionary[key]) {
            elements[i].setAttribute('data-original-title', dictionary[key]);
        } else {
            console.error('No locale for ' + key);
        }
    }

    var elements = [].slice.call(document.querySelectorAll('[data-locale-paragraphs]'));
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-locale-paragraphs');
        if (dictionary[key]) {
            var lines = dictionary[key].split('. ');
            elements[i].innerHTML = lines.map(function (line) {
                return '<p>' + (line.slice(-1) == '.' ? line : (line + '. ')) + '</p>';
            }).join('');
        } else {
            console.error('No locale for ' + key);
        }
    }
}

function loadLocale(lang) {
    $.ajax({
        url: 'locale/' + lang + '.tsv?' + localeVer,
        dataType: 'text',
        success: function (data) {
            dictionary = {};
            var lines = data.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line) {
                    var arr = lines[i].split('\t');
                    if (arr.length === 2) {
                        dictionary[arr[0]] = arr[1].trim();
                    } else {
                        console.log('getLocale error', line);
                    }
                }
            }
            localize(lang, dictionary);
        }
    });
}

function SetUserLocale() {
    lang = 'en';
    var langList = ['ru', 'en', 'de', 'kr', 'es', 'ch', 'tr'];
    if (localStorage.getItem('lang')) {
        lang = localStorage.getItem('lang');
    } else {
        var userLang = navigator.language.substr(0, 2);
        for (var i = 0; i < langList.length; i++) {
            if (userLang == langList[i]) {
                lang = userLang;
                break;
            }
        }
        try {
            localStorage.setItem('lang', lang);
        } catch (e) {
            // browser don't support localStorage
        }
    }
    loadLocale(lang);
}

(function () {
    //var lang = (getUrlVars()['lang'] || 'en').toLowerCase();
    var lang = (getUrlVars()['lang']);
    if (!(lang)) {
        SetUserLocale();
    }
    else {
        try {
            localStorage.setItem('lang', lang);
        } catch (e) {
            // browser don't support localStorage
        }
        loadLocale(lang);
    }
})();

function PrintLocale() {
	var elements = [].slice.call(document.querySelectorAll('[data-locale]'));
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i].getAttribute('data-locale') + '	' + elements[i].innerHTML + '	');
    }
	
	var elements = [].slice.call(document.querySelectorAll('[data-locale-paragraphs]'));
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i].getAttribute('data-locale-paragraphs') + '	' + elements[i].innerHTML.replace(/(<p>|<\/p>)/g, "") + '	');
    }
	
	var elements = [].slice.call(document.querySelectorAll('[data-locale-placeholder]'));
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i].getAttribute('data-locale-placeholder') + '	' + elements[i].placeholder + '	');
    }

    var elements = [].slice.call(document.querySelectorAll('[data-locale-title]'));
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i].getAttribute('data-locale-title') + '	' + elements[i].getAttribute('data-original-title', '111') + '	');
    }
	
	var elements = [].slice.call(document.querySelectorAll('[data-locale-value]'));
    for (var i = 0; i < elements.length; i++) {
		console.log(elements[i].getAttribute('data-locale-value') + '	' + elements[i].value + '	');
    }
};

function CheckLocale() {
	var elements = [].slice.call(document.querySelectorAll('[data-locale]'));
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = 'loc_' + elements[i].getAttribute('data-locale');
    }

    var elements = [].slice.call(document.querySelectorAll('[data-locale-placeholder]'));
    for (var i = 0; i < elements.length; i++) {
        elements[i].placeholder = 'loc_' + elements[i].getAttribute('data-locale-placeholder');
    }

    var elements = [].slice.call(document.querySelectorAll('[data-locale-paragraphs]'));
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = 'loc_' + elements[i].getAttribute('data-locale-paragraphs');
    }

    var elements = [].slice.call(document.querySelectorAll('[data-locale-title]'));
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('data-original-title', 'loc_' + elements[i].getAttribute('data-locale-title'));
    }
	
	var elements = [].slice.call(document.querySelectorAll('[data-locale-value]'));
    for (var i = 0; i < elements.length; i++) {
        elements[i].value = 'loc_' + elements[i].getAttribute('data-locale-value');
    }
};