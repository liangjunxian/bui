;(function($){
  function _get_position(target){
    return {
      top: target.offset().top,
      left: target.offset().left,
      width: target.outerWidth(),
      height: target.outerHeight(),
      winWidth: $(window).width(),
      winHeight: $(window).height(),
    };
  }
  // 获取元素坐标

  function deleteCombobox(event){
    var node = event.target;
    while (node) { //循环判断至跟节点，防止点击的是div子元素 
      if (node.className == 'bui_combobox' || node.className == 'combobox_node') {      
        return;
      }
      node = node.parentNode;
    }
    $('.bui_combobox').remove();
    $(document).unbind('click', deleteCombobox);
  };
  // 点击元素外删除元素

  function renderItems(items) {
    var nodes = '';
    if(items instanceof Array && items.length > 0){
      $.each(items, function(i, item) {
        if(item.children instanceof Array && item.children.length > 0) {
          nodes += '<li class="bui_combobox_item" data_value="'+ item.value +'" data_name="'+ item.name +'"><div class="bui_combobox_node"><span class="bui_combobox_switch"><span class="glyphicon glyphicon-triangle-right"></span></span>'+ item.name +'</div><ul class="bui_combobox_ul">'+ renderItems(item.children) +'</ul></li>'
        } else {
          nodes += '<li class="bui_combobox_item" data_value="'+ item.value +'" data_name="'+ item.name +'"><div class="bui_combobox_node"><span class="bui_combobox_empty"></span>'+ item.name +'</div></li>'
        }
      });
    }
    return nodes;
  };
  // 渲染选项

  $.fn.combobox = function(option) {
    var initOption = {
      options: [],        // 选项
      initValue: [],      // 初始值
      name: '',           // 名字
      multiselect: false, //是否可以多选
      disabled: false,    // 是否禁用
      format: null,       // 格式化
      onChange: null,     // 
    };
    var self = $(this);
    var opt = $.extend(initOption, option);
    var results = opt.initValue;
    if (self[0].localName !== 'input') {
      if(results) {
        self.attr('data_value', results.join(','));
      }
      self.append('<span></span><input value="'+ results.join(',') +'" style="display: none;" disabled="'+ opt.disabled +'" name="'+ opt.name +'" />');
      if(opt.format instanceof Function){
        self.find('span').html(opt.format(results));
      }
    } else {
      if (!self.attr('name')) {
        self.attr('name', opt.name);
      }
      if(results) {
        self.attr('value', results.join(','));
      }
    }
    if(self.attr('disabled') || opt.disabled) {
      if (opt.disabled) {
        self.attr('disabled', opt.disabled);
      }
      return;
    }
    self.on('click', function(event) {
      event.stopPropagation();
      $('.bui_combobox').remove();
      var attr = _get_position(self);
      var leftStyle = attr.left > attr.winWidth/2 ? 'right:'+(attr.winWidth-attr.left-attr.width)+'px' : 'left:'+attr.left+'px;';
      var topStyle = attr.top > attr.winHeight / 2 ? 'bottom:'+ (attr.winHeight-attr.top)+'px' : 'top:'+(attr.top+attr.height)+'px;';
      var styles = leftStyle + topStyle;
      var items = renderItems(opt.options);
      $('body').append('<div class="bui_combobox" style="'+styles+'width:'+attr.width+'px;" >'+ items +'</div>');
      $(document).bind('click', deleteCombobox);
      $('.bui_combobox').on('click', '.bui_combobox_switch', function(ev){
        ev.stopPropagation();  
        $(this).toggleClass('curr');
        $(this).parent().siblings('ul').slideToggle();
      });
      $('.bui_combobox').on('click', '.bui_combobox_item', function(ev){
        ev.stopPropagation();
        var itemValue = $(this).attr('data_value');
        var itemName = $(this).attr('data_name');
        console.log(itemValue, itemName);
        if (typeof opt.multiselect === 'boolean' && opt.multiselect) {
          var resIndex = $.inArray(itemValue, results);
          if(resIndex === -1){
            results.push(itemValue);
            $(this).find('.bui_combobox_node').eq(0).addClass('active');
          } else {
            results.splice(resIndex, 1);
            $(this).find('.bui_combobox_node').eq(0).removeClass('active');
          }
        } else {
          results = [itemValue];
          $(this).find('.bui_combobox_node').eq(0).addClass('active');
          $(this).siblings().find('.bui_combobox_node').eq(0).removeClass('active');
        }
        if(opt.format instanceof Function){
          self.find('span').html(opt.format(results));
        }
      });
    });
  };
})(jQuery);