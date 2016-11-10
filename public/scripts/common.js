// console 객체가 없을 경우
if (!window.console) {
	window.console = {
		log : function(){},
		dir : function(){}
	};
} else if (!window.console.dir){
	window.console.dir = function(){};
}




/* Common Menus */
var CommonMenus = (function ($) {
	var scope,
		$container,
		$toggleMenus,
		$menus,
		$liMenus,
		init = function () {
			$container = $('.layout-sidemenu');
			$toggleMenus = $('.layout-header-utils .btn-menus');
			$menus = $container.find('.list-menus > li > .menu');
			$liMenus = $container.find('.list-menus > li');

			initLayout();
			initEvent();
		};//end init

	function initLayout() {
		// set menu on/off
		var menu = $.cookie('menu');
		$('body').attr('data-state', menu);

		//set theme
		var theme = $.cookie('theme');
		$('html').attr('data-theme', theme);
	}

	function initEvent() {
		// toggle menu
		$toggleMenus.on('click', function(e) {
			var state = $('body').attr('data-state');
			$('body').attr('data-state', (state == '' || state == undefined) ? 'is-open' : '')
			if( state == '' || state == undefined ) {
				$.cookie('menu', 'is-open');
				$('body').attr('data-state', 'is-open');
			} else {
				$.cookie('menu', '');
				$('body').attr('data-state', '');
			}
		});

		// side menu
		$menus.on('click', function(e) {
			$('.list-menus > li').attr('data-state', '');
			
			var $target = $(this).closest('li');
			$target.attr('data-state', 'is-selected');
		});

		$liMenus.on('mouseenter', function(e) {
			if( $('body').attr('data-state') == "is-open" ) return;

			$(this).attr('data-prev-state', $(this).attr('data-state'));
			$(this).attr('data-state', 'is-hover');
		});
		$liMenus.on('mouseleave', function(e) {
			if( $('body').attr('data-state') == "is-open" ) return;

			var prev = '';
			if( $(this).attr('data-prev-state') != undefined ) {
				prev = $(this).attr('data-prev-state');
			}
			$(this).attr('data-state', prev);
			$(this).attr('data-prev-state', '');
		});
	}

	return {
		init: function () {
			scope = this;

			init();
		}
	};
}(jQuery));



/* node operation - dimming level */
var NodeOperationControl = (function ($) {
	var $container,
		$segmentedControl,
		$visualStatus,
		$bulb,
		$displayDimmingValue,
		$dragControl,
		$customizeValue,
		_controlType = { Level : 0, Blink : 1, NDL : 2 },
		_currentType,
		_isManualMode,
		_selectColor,
		fgColor = ['#518f10', '#0b8a8e'],
		init = function(type, isManual) {
			$container = $('.noc-detail');
			$segmentedControl = $container.find('input[name=dimming]');
			$visualStatus = $container.find('.visual-status');
			$bulb = $visualStatus.find('.bulb');
			$displayDimmingValue = $visualStatus.find('.value');
			$dragControl = $container.find(".drag-control");
			$customizeValue = $('#customize');

			_currentType = type;
			_selectColor = fgColor[0];

			initLayout();
			initEvent();
			_updateMode(isManual);
		};//end init

	function initLayout() {
	}

	function initEvent() {
		$dragControl.knob({
			"fgColor": _selectColor,
			change : function(value) {
				_updateKonbValue(value);
				$customizeValue.attr('value', value);
			},
			release : function(value) {
				_updateKonbValue(value);
			}
		});

		// Dimming Level Only 
		if( _currentType == _controlType.Level ) {
			$segmentedControl.on('click', function(e) {
				var value = $(this).val();
				$dragControl.val(value).trigger('change');
				_updateKonbValue(value);

				// disabled 처리
				if( value == 100 || value == 0 ) {
					_setDisableControls(true);
				} else {
					_setDisableControls(false);
				}
			});

			$segmentedControl.eq(0).trigger('click');
		}

	}

	function _updateType(type) {
		_currentType = type;
	}

	function _updateMode(isManual) {
		_isManualMode = isManual;
		_selectColor = _isManualMode ? fgColor[1] : fgColor[0];

		$dragControl.trigger('configure', {
			"fgColor" : _selectColor,
			"inputColor" : _selectColor
		});
	}

	function _setDisableControls(isDisabled) {
		$container.find('.view.right *').attr("disabled", isDisabled);
	}

	function _updateKonbValue(value) {
		if( _currentType == _controlType.Level ) {
			$bulb.css('opacity', value/100);

			if( value > 99 ) {
				$visualStatus.attr('data-state', "on");
				$displayDimmingValue.html("ON");
			} else if( value < 1 ) {
				$visualStatus.attr('data-state', "off");
				$bulb.css('opacity', 1);
				$displayDimmingValue.html("OFF");
			} else {
				$visualStatus.attr('data-state', "customize");
				$displayDimmingValue.html(Math.floor(value)+"<sup>%</sup>");
			}
		}

		if( _currentType == _controlType.Blink || _currentType == _controlType.NDL ) {
			$displayDimmingValue.html(Math.floor(value));
		}

	}

	return {
		init: function(type, isManual) {
			init(type, isManual);
		},
		updateType: function(type) {
			_updateType(type);
		},
		updateMode: function(isManual) {
			_updateMode(isManual);
		}
	};
}(jQuery));



$(document).ready(function(e) {
	// custom select box
	$('.selectpicker').selectpicker();

	// clock picker
	$('.clockpicker').clockpicker({
	    placement: 'bottom',
	    align: 'left',
	    autoclose: true,
	    donetext: 'Done'
	});

	// tooltip
	$('.btn-tooltip').tooltipster({
		"arrow": false,
		"maxWidth": 200
	});

	CommonMenus.init();
});

jconfirm.defaults = {
	title: '',
	content: '',
	theme: '',
	animation: 'top',
	closeAnimation: 'bottom',
	backgroundDismiss: false,
	closeIcon: true,
};







