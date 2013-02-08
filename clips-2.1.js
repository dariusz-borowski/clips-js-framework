/*
Copyright (c) 2010-2012 Dariusz Borowski <http://e-borowski.pl>

Clips JS Framework 2.1

Created: 2010-10-01
Release: 2012-9-05
License: The MIT License http://clips-framework.tk/mit-license.txt
Download: http://clips-framework.tk/
*/

(function(window) {

	var clips = function( selector, context ) {

		return new clips.construct.prepare( selector, context );

	};

	clips.construct = clips.prototype = {

		constructor: clips,

		clips: function(selector, context) {

			var index = 0;

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					var o = new clips.construct.prepare( selector, this[i] );

					for(var j in o) {

						if (o[j] && o[j].nodeType && o[j].nodeType == 1) {

							this[index] = o[j];
							index++;

						}

					}

				}

			}

			return this;

		},

		prepare: function( selector, context ) {

			var selector = selector || false;

			if (!selector) {

				this[0] = window;
				return this;

			}

			context = context || document;

			if ( !context.nodeType ) {

				context = context[0];

			}

			if ( selector.nodeType ) {

				this[0] = selector;
				return this;

			}

			if ( selector === 'body' && document.body ) {

				this[0] = document.body;
				return this;

			}

			try {

				var elements = context.querySelectorAll(selector);

			} catch(e) {

				return this;

			}

			for(var i=0; i<elements.length; i++) {

				this[i] = elements[i];

			}

			return this;
		},

		foreach: function(callback) {

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1)
					callback.call(this[i]);

			}

		},

		toggle: function(display) {

			var display = display || 'none';

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					if (this[i].style.display == display)
						this[i].style.display = 'block'; else
						this[i].style.display = display;

				}

			}

		},

		addClass: function(name) {

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					var parts = this[i].className.split(' ');
					var found = false;

					for (j in parts) {

						if (parts[j] == name) {

							found = true;
							break;

						}

					}

					this[i].className += (parts.length > 0 ? ' ' : '') + name;

				}

			};

		},

		removeClass: function(name) {

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					this[i].className = this[i].className.replace(' ' + name, '').replace(name, '');

				}

			};

			return this;

		},


		show: function(display) {

			if (clips._isundefined(display))
				display = 'block';

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					this[i].style.display = display;

				}

			};

			return this;

		},

		hide: function() {

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					this[i].style.display = 'none';

				}

			};

			return this;

		},

		remove: function() {

			clips.foreach(function(e) {

					if (e && e.parentNode)
						e.parentNode.removeChild(e);

				}
			)

		},

		first: function(callback) {

			if (clips._isundefined(callback)) {

				if (this[0] && this[0].nodeType && this[0].nodeType == 1) {

					return clips(this[0]);

				} else {

					return clips();

				}

			}

			if (this[0]) {

				callback(this[0]);

			} else return clips();

		},

		last: function(callback) {

			var index = -1;
			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					index++;

				}

			}

			if (index ==  -1)
				return clips();

			if (clips._isundefined(callback)) {

				if (this[index] && this[index].nodeType && this[index].nodeType == 1) {

					return clips(this[index]);

				} else {

					return clips();

				}

			}

			if (this[index]) {

				callback(this[index]);

			} else return clips();

		},

		html: function(html, replace) {

			if (clips._isundefined(replace))
				replace = true;

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					if (!replace) {

						this[i].innerHTML += html;

					} else {

						this[i].innerHTML = html;

					}

				}

			}

			return this;

		},


		attr: function(attribute, value) {

			if (!clips._isundefined(value)) {

				for(var i in this) {

					if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

						this[i].setAttribute(attribute, value);

					}

				}

				return this;

			} else {

				if (this[0] && this[0].nodeType && this[0].nodeType == 1) {

					return this[0].getAttribute(attribute);

				}

			}

		},

		click: function(callback) {

			var callback = callback || false;

			for(var i in this) {

				if (this[i] && this[i].nodeType && this[i].nodeType == 1) {

					var _callback = callback;

					clips._addEvent(this[i], 'click', function(event) {

						if (_callback) {

							_callback.call(this, event)

						}

					});

				}

			}

			return this;

		},

		event: function(event, callback) {

			var _callback = callback;

			for(var i in this) {

				if (this[i] && ((this[i].nodeType && this[i].nodeType == 1) || this[i] == window)) {

					clips._addEvent(this[i], event, function(event) {

						_callback(event);

					});

				}

			}

			return this;
		},


		key: function(event) {

			var keycode;
			if (window.event) keycode = window.event.keyCode;
			else if (event) keycode = (event.which) ? event.which : event.keyCode;
			return keycode;

		}

	};

	clips.construct.prepare.prototype = clips.construct;

	var mainClips = clips(document);

	// private
	clips._addEvent = function (obj, evType, fn) {

		if(obj.addEventListener) {
			obj.addEventListener(evType, fn, true)
			return false;
		}

		if(obj.attachEvent) {
			obj.attachEvent("on"+evType, fn)
			return false;
		}
	};


	clips._removeEvent = function (obj, type, fn) {
		if(obj.detachEvent){
			obj.detachEvent('on'+type, fn);
		}else{
			obj.removeEventListener(type, fn, false);
		}
	};


	clips._isundefined = function(object) {

		return (typeof object == 'undefined');

	};
	// end private

	window.clips = clips;

})(window);
