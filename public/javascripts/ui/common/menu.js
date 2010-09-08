dc.ui.Menu = dc.View.extend({

  className : 'minibutton menu',

  callbacks : {
    'el.click'        : 'open',
    'el.selectstart'  : '_stopSelect'
  },

  constructor : function(options) {
    _.bindAll(this, 'close');
    options = _.extend(this.defaultOptions(), options || {});
    this.base(options);
    this.items          = [];
    this.content        = $(JST['common/menu'](this.options));
    this.itemsContainer = $('.menu_items', this.content);
    this.addIcon        = $('.bullet_add', this.content);
    this.modes.open     = 'not';
    if (options.items) this.addItems(options.items);
  },

  defaultOptions : function() {
    return {id : null, standalone : false};
  },

  render : function() {
    $(this.el).html(JST['common/menubutton']({label : this.options.label}));
    this._label = $('.label', this.el);
    $(document.body).append(this.content);
    this.setCallbacks();
    return this;
  },

  open : function() {
    var content = this.content;
    if (this.modes.enabled == 'not') return false;
    if (this.modes.open == 'is' && !this.options.standalone) return this.close();
    this.setMode('is', 'open');
    if (this.options.onOpen) this.options.onOpen(this);
    content.show();
    content.align(this.el, '-left bottom no-constraint');
    content.autohide({onHide : this.close});
    return this;
  },

  close : function(e) {
    if (e && this.options.onClose && !this.options.onClose(e)) return false;
    this.setMode('not', 'open');
    return true;
  },

  enable : function() {
    this.setMode('is', 'enabled');
  },

  disable : function() {
    this.setMode('not', 'enabled');
  },

  // Show the menu button as being currently open, with another click required
  // to close it.
  activate : function(callback) {
    this._activateCallback = callback;
    this.setMode('is', 'active');
  },

  deactivate : function(e) {
    if (this.modes.active == 'is') {
      this.setMode('not', 'active');
      if (this._activateCallback) this._activateCallback();
      return false;
    }
  },

  clear : function() {
    this.items = [];
    $(this.itemsContainer).html('');
    this.content.setMode(null, 'selected');
  },

  setLabel : function(label) {
    $(this._label).text(label || this.options.label);
  },

  addItems : function(items) {
    this.items = this.items.concat(items);
    var elements = _(items).map(function(item) {
      var attrs = item.attrs || {};
      _.extend(attrs, {'class' : 'menu_item ' + attrs['class']});
      var el = $.el('div', attrs, item.title);
      item.menuEl = $(el);
      if (item.onClick) $(el).bind('click', function(e) {
        if ($(el).hasClass('disabled')) return false;
        item.onClick(e);
      });
      return el;
    });
    $(this.itemsContainer).append(elements);
  },

  select : function(item) {
    this.selectedItem = item;
    item.menuEl.addClass('selected');
  },

  deselect : function() {
    if (this.selectedItem) this.selectedItem.menuEl.removeClass('selected');
    this.selectedItem = null;
  },

  _stopSelect : function(e) {
    return false;
  }

});