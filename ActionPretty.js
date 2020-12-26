'use strict';

import AppBody from "../Components/AppBody";

/**
 * Helper class for handling buttons and other smaller sections
 */
//Assumes bootstrap and Font-awesome
const CN = {
	DIS: 'disabled',
	SP: 'fa-spin',
	H: 'hidden',
}

//SPINNERS FONT-AWESOME
const FAWSPIN = {
	CIR: 'fa fa-circle-o-notch',
	COG: 'fa fa-cog',
	GEAR: 'fa fa-gear',
	REF: 'fa fa-refresh',
	SPR: 'fa fa-spinner',
	ERRC: 'fa fa-exclamation-circle',
	ERRT: 'fa fa-exclamation-triangle',
}

const FAW = {
	USER_P: 'fa fa-user-plus',
	USER_M: 'fa fa-user-minus',
}

const B = {
	H: 'hidden',
	DH: '.hidden',
	A: 'btn-active',
	DA: '.btn-active',
}

const MODA = {
	c: 'modal-content',
	m: 'modal',
}


/**
 * Stands for ACTION PRETTY!
 * SPINNERS
 * FADES
 * ETC..
 */
class AP {
	constructor($links){
		//can be multiple
		this.$lk = $links;
		//weak map this??
		const $i = $links.find('i');
		if($i !== undefined){
			this.oldClass = $i.attr('class');
		}
	}
	
	disable(){
        	this.$lk.addClass(CN.DIS).attr(CN.DIS, true);
        	//return this;
    	}
	
    	enable(){
        	this.$lk.removeClass(CN.DIS).attr(CN.DIS, false);
        	//return this;
    	}

    	addSpin(){
    		//save class or create font-awesome save class for adding later
		this.$lk.find('i')
			.removeClass()
			.addClass(FAWSPIN.SPR)
			.addClass(CN.SP);
		return this;
	}

	stopSpin(){
		this.$lk.find('i')
			.removeClass()
			.addClass(this.oldClass);

		//console.log('stop spin');
	}


    	removeRow(){
    		this.removeClosest('tr')
    	}

    	removePanel(){
		this.removeClosest('.panel');
    	}

    	flipHiddenRow(prev = false){
		let $p = $(this.$lk.closest('tr'));
		if (prev === true) {
            $p = $($p.prev());
            if($p === undefined){
            	alert('Cannot perform action');
            	this.$lk.stopPropagation();
			}
		}
		console.log($p);
		AP.switchHiddenButtons($p);
        	console.log('switched');

	}

	static switchHiddenButtons($con){
		console.log($con);
		let $h = $($con.find('.'+B.H)), $b  = $($con.find('.'+B.A));
        	console.log($h, $b);
        	$h.addClass(B.A).removeClass(B.H);
        	$b.addClass(B.H).removeClass(B.A);
	}

    	removeClosest(el){
    		const $el = this.$lk.closest(el);
        	return new Promise((resolve, reject)=> {
			$el.fadeOut('200', () => {
				$el.remove();
				console.log('removed '+el);
				resolve();
				});
				reject();
        		})
    	}

    	loadBut(){
		this.$lk.button('loading');
		return this;
	}

	resetBut(){
		this.$lk.button('reset');
	}

	getData(dataElement){
		return this.$lk.data(dataElement);
	}


	static toJq(obj){
        	if (!obj instanceof jQuery) {
            		obj = $(obj);
        	}
        	return obj;	
	}
	
	static isJson(jsn){
		if (jsn === undefined || jsn === null) {
			return null;
		}
        	
		if (!JSON.parse(jsn)) {
            		return null;
        	}	
        	
		return JSON.parse(jsn);
	}

	static _formAction(e) {
		e.preventDefault();
		let target = $(e.currentTarget);
		return {
			target,
			data: target.serializeArray(),
			action: target.attr('action'),
            		isModal: target.hasClass('modal_form')
		};
	}


	static invalidFeedback($input, $app, message=null) {
		$input.removeClass('is-valid');
		$input.addClass('is-invalid');
		$app.append(invalidMessage(message));
	}

	static validFeedback($input, $app, message=null) {
		$input.removeClass('is-invalid');
		$input.addClass('is-valid');
		if (message !== null) {
			$app.append(validMessage(message));
		}
	}

	/*HELPERS = */
	static addHtml($subject, html=null, concatType = "html", trueHtml=null) {
		if (html !== null) {
			let allHtml = trueHtml !== null ? trueHtml : html;
			if (concatType === "html") {
				 $subject.html(allHtml);
			} else if (concatType === "append") {
			     $subject.append(allHtml);
			} else if (concatType === "prepend") {
			     $subject.prepend(allHtml);
			}
		}
	}

	static addInputFeedback($input, message, valid=false) {
		let feed = valid === true
			? ['is-valid', validMessage(message)]
			: ['is-invalid', invalidMessage(message)] ;
		AP.addRemoveClasses($input, ['is-valid', 'is-invalid'], feed[0])
		/*$input.removeClass('is-valid')
			.removeClass('is-invalid')
			.addClass(feed[0])*/
		$input.after(feed[1]);
	}
	
	static addRemoveClasses($subject, rclasses, aclasses){
		if (typeof rclasses === "string") {
			$subject.removeClass(rclasses);
		} else if (typeof rclasses === "object") {
			for (let r of rclasses) {
				$subject.removeClass(rclasses[r]);
			}
		}

		if (typeof aclasses === "string") {
			$subject.addClass(aclasses);
		} else if (typeof aclasses === "object") {
			for (r of aclasses) {
				$subject.addClass(r);
			}
		}
	}

	static ajaxFun(aj, t, c, a) {
		aj.then(t).catch(c).always(a);
	}

	static replaceHtml(data, textStatus) {
		console.log(data, textStatus);
	}

	static _targets(e) {
		return {
			target: $(e.target),
			current: $(e.currentTarget),
			delegate: $(e.delegateTarget),
			related: $(e.relatedTarget),
		};
	}

	static _current(e) {
		return AP._targets(e).current;
	}

	static _targetHtml($jq) {
		return {
			target: $jq.data('target'),
			toggle: $jq.data('toggle'),
			html: $jq.data('html'),
		};
	}
	
	static _buttonTargets(e) {
		let t = AP._targets(e), b = AP._targetHtml(t.current);
		console.log(t, b);
		return {t, b};
	}
	
	static _bootstrapifyTarget(toggle, $item) {
		if (toggle.indexOf("click") === 0) {
			$item.click();
		} else {
			switch (toggle) {
				case 'collapse':
					$item.collapse('show');
					break;
				case 'tab':
					$item.tab('show');
					break;
				case 'modal':
					$item.tab('show');
					break;
				default:
					window.location.href = $item.data('html');
					break;
			}
		}
	}

	static _animateTo($container, $scrollTo, doAnimation=false) {
		let offset = $scrollTo.offset().top - $container.offset().top + $container.scrollTop();
		if (doAnimation === false) {
			$container.scrollTop(
				offset
			);
		} else {
			$container.animate({scrollTop: offset})
		}

	}

	static _fancyActionBinding($wrapper) {
		$wrapper.find('.bootstrapify[data-toggle="collapse"]').collapse();
		$wrapper.find('.bootstrapify[data-toggle="modal"]').modal();
		$wrapper.find('.bootstrapify[data-toggle="dropdown"]').dropdown();
		$wrapper.find('.bootstrapify[data-toggle="tab"]').tab();

		$wrapper.find('.text-anchor, .i-anchor').on('click', function () {
			window.location.href = $(this).data('html');
		});

		$wrapper.find('select[multiple="multiple"]').bsMultiSelect();
		$('ul.form-control').addClass('w-100');

		$wrapper.on(
			'change', '.change_form',
			function (e) {
				AppBody.changeFormUpdate(e);
			}
		);

		$wrapper.find('.btn-group, .dropdown').each(function (index) {
			let $modals = $($(this).find('.modal'));
			if ($modals !== undefined && $modals.length > 0) {
				$(this).after($modals);
				/*$modals.remove();*/
			}
		});



	}

	static dropdownSearch($drop, data, options) {
		//for each data
		//options
		let midle = "";
		if (options.headerSearch === true) {
			for (let d of new Map(data)) {
				console.log(d);
			}
		} else {
			for (let d of data) {
				console.log(d);
			}
		}

		if ($drop.hasClass('show')) {
			$drop.dropdown('update');
		} else {
			$drop.dropdown('toggle');
		}

		
		

	}


	/*
	* TODO:
	*  ADD TOAST NOTIFICATIONS
	*  ADD SPINNERS
	*  SPAN UPDATING
	*
	*/

}

const invalidMessage = (message) => `<div class="invalid-feedback">${message}</div>`;
const validMessage = (message) => `<div class="valid-feedback">${message}</div>`;
const spinner = (color) => `<div class="spinner-border text-${color}" role="status"> <span class="sr-only">Loading...</span> </div>`;
const spinnerGrow = (color) => `<div class="spinner-grow text-${color}" role="status"> <span class="sr-only">Loading...</span> </div>`;
const dropdownSearch = (thumb, name) => `<div class="spinner-grow text-${color}" role="status"> <span class="sr-only">Loading...</span> </div>`;
//TOOLTIP
//POPOVER


export default AP;
