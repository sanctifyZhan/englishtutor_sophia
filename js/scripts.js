/*
 *  I18n.js
 *  =======
 *
 *  Simple localization util.
 *  1. Store your localized labels in json format: `localized-content.json`
 *  2. Write your markup with key references using `data-i18n` attributes.
 *  3. Explicitly invoke a traverse key resolver: `i18n.localize()`
 *     OR
 *     Change the language, and the contents will be refreshed: `i18n.lang('en')`
 *
 *  This util relies on jQuery to work. I would recommend using the latest version
 *  available (1.12.x or 2.1.4+), although this will probably run with any older
 *  version since it is only taking advantage of `$.getJSON()` and the jQuery
 *  selector function `$()`.
 * 
 *  © 2016 Diogo Simões - diogosimoes.com
 *
 */



var demoJson = {
	"home": {
		"1": {
			"vn": "Giáo viên tiếng việt",
			"en": "Vietnamese teacher",
			"fr": "Professeur de vietnamien"
		},
		"2": {
			"vn": "Số năm giảng dạy : 6 năm\n System Design Center (d.lab)\nThe University of Tokyo, Japan",
			"en": "作成中\n",
			"fr": ""
		},
		"3": {
			"vn": "\n\nContact \nEmail: khanh (at) silicon (dot) u-tokyo (dot) ac (dot) jp",
			"en": "作成中",
			"fr": ""
		},
	},
	"res": {
		"1": {
			"vn": "\nResearch",
			"en": "研究\n",
			"fr": ""
		},
	},
	"pub": {
		"text": {
			"vn": "tieng anh ",
			"en": "現在作成中につき、しばらくお待ち下さい。",
			"fr": ""
		},
	}
};

(function () {
	this.I18n = function (defaultLang) {
		var lang = defaultLang || 'vn';
		this.language = lang;

		(function (i18n) {
			i18n.contents = demoJson;
			i18n.contents.prop = function (key) {
				var result = this;
				var keyArr = key.split('.');
				for (var index = 0; index < keyArr.length; index++) {
					var prop = keyArr[index];
					result = result[prop];
				}
				return result;
			};
			i18n.localize();
		})(this);
	};

	this.I18n.prototype.hasCachedContents = function () {
		return this.contents !== undefined;
	};

	this.I18n.prototype.lang = function (lang) {
		if (typeof lang === 'string') {
			this.language = lang;
		}
		this.localize();
		return this.language;
	};

	this.I18n.prototype.localize = function () {
		var contents = this.contents;
		if (!this.hasCachedContents()) {
			return;
		}
		var dfs = function (node, keys, results) {
			var isLeaf = function (node) {
				for (var prop in node) {
					if (node.hasOwnProperty(prop)) {
						if (typeof node[prop] === 'string') {
							return true;
						}
					}
				}
			}
			for (var prop in node) {
				if (node.hasOwnProperty(prop) && typeof node[prop] === 'object') {
					var myKey = keys.slice();
					myKey.push(prop);
					if (isLeaf(node[prop])) {
						//results.push(myKey.reduce((prev, current) => prev + '.' + current));	//not supported in older mobile broweser
						results.push(myKey.reduce(function (previousValue, currentValue, currentIndex, array) {
							return previousValue + '.' + currentValue;
						}));
					} else {
						dfs(node[prop], myKey, results);
					}
				}
			}
			return results;
		};
		var keys = dfs(contents, [], []);
		for (var index = 0; index < keys.length; index++) {
			var key = keys[index];
			if (contents.prop(key).hasOwnProperty(this.language)) {
				$('[data-i18n="' + key + '"]').text(contents.prop(key)[this.language]);
				$('[data-i18n-placeholder="' + key + '"]').attr('placeholder', contents.prop(key)[this.language]);
				$('[data-i18n-value="' + key + '"]').attr('value', contents.prop(key)[this.language]);
			} else {
				$('[data-i18n="' + key + '"]').text(contents.prop(key)['vn']);
				$('[data-i18n-placeholder="' + key + '"]').attr('placeholder', contents.prop(key)['vn']);
				$('[data-i18n-value="' + key + '"]').attr('value', contents.prop(key)['vn']);
			}
		}
	};

}).apply(window);

$(document).ready(function () {

	var i18n = new I18n();
	i18n.localize();
	$('.lang-picker #vietnamese').addClass('selected');

	var pass = localStorage.getItem("mySelectValue");
	console.log("js + " + pass);


	$('.lang-picker #vietnamese').on('click', function () {
		i18n.lang('vn');
		selectLang($(this));
	})
	$('.lang-picker #english').on('click', function () {
		i18n.lang('en');
		selectLang($(this));
	})
	$('.lang-picker #french').on('click', function () {
		i18n.lang('fr');
		selectLang($(this));
	})

	// function selectLang(picker) {
	// 	$('.lang-picker li').removeClass('selected');
	// 	picker.addClass('selected');
	// }
	if (pass == 1) {
		$(document).ready(function () {
			var i18n = new I18n();
			i18n.localize();
			i18n.lang('en');
			selectLang($(this));
		})
	}
	else if (pass == 0) {
		$(document).ready(function () {
			var i18n = new I18n();
			i18n.localize();
			i18n.lang('vn');
			selectLang($(this));
		})
	}
	else if (pass == 2) {
		$(document).ready(function () {

			var i18n = new I18n();
			i18n.localize();
			i18n.lang('fr');
			selectLang($(this));
		})
	}
	function selectLang(picker) {
		$('.lang-picker li').removeClass('selected');
		picker.addClass('selected');
	}
});

