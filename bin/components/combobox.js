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

  function _delete_combobox(event){
    var node = event.target;
    while (node) { //循环判断至跟节点，防止点击的是div子元素 
      if (node.className == 'bui_combobox_popover' || node.className == 'bui_combobox_node') {      
        return;
      }
      node = node.parentNode;
    }
    $('.bui_combobox_popover').remove();
    $(document).unbind('click', _delete_combobox);
  };
  // 点击元素外删除元素

  function _render_items(items, values) {
    var nodes = '';
    if(items instanceof Array && items.length > 0){
      $.each(items, function(i, item) {
        var curr = $.inArray(item.value, values) !== -1 ? 'active' : '';
        if(item.children instanceof Array && item.children.length > 0) {
          nodes += '<li class="bui_combobox_item" data_value="'+ item.value +'" data_name="'+ item.name +'"><div class="bui_combobox_node '+ curr +'"><span class="bui_combobox_switch"><span class="glyphicon glyphicon-triangle-bottom"></span></span>'+ item.name +'</div><ul class="bui_combobox_ul">'+ _render_items(item.children, values) +'</ul></li>'
        } else {
          nodes += '<li class="bui_combobox_item" data_value="'+ item.value +'" data_name="'+ item.name +'"><div class="bui_combobox_node '+ curr +'"><span class="bui_combobox_empty"></span>'+ item.name +'</div></li>'
        }
      });
    }
    return nodes;
  };
  // 渲染选项

  function _get_selecteds(values, options) {
    var results = [];
    var options = _format_options(options);
    $.each(options, function(i, item) {
      if($.inArray(item.value, values) !== -1){
        results.unshift(item);
      }
    });
    return results;
  }
  // 获取已选对象

  function _format_options(options) {
    var results = [];
    function loopTree (arr, group) {
      if(arr instanceof Array && arr.length > 0){
        $.each(arr, function(i, item) {
          if(item.children instanceof Array && item.children.length > 0) {
            loopTree(item.children, group);
          }
          group.push({
            name: item.name,
            value: item.value,
          });
        });
      }
    }
    loopTree(options, results); // 平铺树形结构
    return results;
  }

  function _each_value(value, opt) {
    var results = opt.placeholder;
    var selecteds = _get_selecteds(value, opt.options)
    if(selecteds instanceof Array && selecteds.length > 0) {
      if (typeof opt.multiselect === 'boolean' && opt.multiselect) {
        results = $.map(selecteds, function(item){
          return '<span class="bui_combobox_tag" data_value="'+ item.value +'">'+ item.name +'<span class="glyphicon glyphicon-remove bui_combobox_tag_remove"></span></span>'
        }).join('');
      } else {
        results = selecteds[0].name;
      }
      return '<span class="bui_combobox_value">'+ results +'</span>';
    }
    return '<span class="bui_combobox_placeholder">'+ results +'</span>';
  }
  // 渲染文本框值

  function _init(self, initvalue, opt) {
    var value = _each_value(initvalue, opt);
    if(self[0].localName === 'input'){
      var selfClass = self.attr('class');
      self.wrap('<div class="bui_combobox"></div>');
      self.parent().addClass(selfClass);
      $(value).insertBefore(self);
      self.hide();
      self.attr('class', '');
      self.attr('value', opt.value);
      self.attr('name', opt.name);
      self.attr('disabled', opt.disabled);
      return self.parent();
    } else {
      self.attr('data_value', '');
      self.addClass('bui_combobox');
      self.append(value+'<input value="'+ opt.value.join(',') +'" name="'+ opt.name +'" disabled="'+ opt.disabled +'" style="display: none;" />');
      return self;
    }
  }
  // 初始化多选框

  function _init_popover(self, values, opt) {
    $('.bui_combobox_popover').remove();
    var attr = _get_position(self);
    var leftStyle = attr.left > attr.winWidth/2 ? 'right: '+(attr.winWidth-attr.left-attr.width)+'px; ' : 'left: '+attr.left+'px; ';
    var topStyle = attr.top > attr.winHeight / 2 ? 'bottom: '+ (attr.winHeight-attr.top)+'px; ' : 'top: '+(attr.top+attr.height)+'px; ';
    var styles = leftStyle + topStyle;
    var items = _render_items(opt.options, values);
    $('body').append('<div class="bui_combobox_popover" style="'+styles+'width: '+attr.width+'px;" >'+ items +'</div>');
    $(document).bind('click', _delete_combobox);
    return $('.bui_combobox_popover');
  }

  $.fn.combobox = function(option) {
    var initOption = {
      options: [],        // 选项
      value: [],      // 初始值
      name: '',           // 名字
      placeholder: '请选择', // 提示语
      multiselect: false, //是否可以多选
      disabled: false,    // 是否禁用
      format: null,       // 格式化
      onChange: null,     // 
    };
    var self = $(this);
    var opt = $.extend(initOption, option);
    var results = opt.value;

    self = _init(self, results, opt);

    if(self.attr('disabled') || opt.disabled) {
      self.find('input').attr('disabled', true);
      self.addClass('disabled');
      return;
    }

    self.on('click', '.bui_combobox_tag_remove', function(ev){
      ev.stopPropagation();
      var tag = $(this).parent('.bui_combobox_tag');
      var val = tag.attr('data_value');
      var resIndex = $.inArray(val, results);
      var inputText = self.find('.bui_combobox_value');
      var input = self.find('input');
      var item = $('.bui_combobox_popover').find('[data_value='+ val +']');
      item.find('.bui_combobox_node').eq(0).removeClass('active');
      results.splice(resIndex, 1);
      tag.remove();
      if(results.length === 0){
        inputText.addClass('placeholder');
        inputText.text(opt.placeholder);
      }
      input.attr('value', results.join(','));
      if(opt.onChange instanceof Function){
        opt.onChange(_get_selecteds(results, opt.options));
      }
    });
    // 删除标签

    self.on('click', function(event) {
      event.stopPropagation();
      var nowValues = $(this).find('input').val().split(',');
      var popover = _init_popover(self, nowValues, opt);
      if(opt.onChange instanceof Function){
        opt.onChange(_get_selecteds(nowValues, opt.options));
      }

      popover.on('click', '.bui_combobox_switch', function(ev){
        ev.stopPropagation();  
        $(this).toggleClass('curr');
        $(this).parent().siblings('ul').slideToggle();
        if($(this).hasClass('curr')){
          $(this).find('.glyphicon').attr('class', 'glyphicon glyphicon-triangle-right');
        } else {
          $(this).find('.glyphicon').attr('class', 'glyphicon glyphicon-triangle-bottom');
        }
      });
      // 树形开关

      popover.on('click', '.bui_combobox_item', function(ev){
        ev.stopPropagation();
        var itemValue = $(this).attr('data_value');
        var itemName = $(this).attr('data_name');
        var inputText = self.find('.bui_combobox_value');
        var input = self.find('input');
        if (typeof opt.multiselect === 'boolean' && opt.multiselect) {
          var resIndex = $.inArray(itemValue, results);
          if(resIndex === -1) {
            if(results.length === 0){
              inputText.removeClass('placeholder');
              inputText.html('');
            }
            results.push(itemValue);
            inputText.append('<span class="bui_combobox_tag" data_value="'+ itemValue +'">'+ itemName +'<span class="glyphicon glyphicon-remove bui_combobox_tag_remove"></span></span>');
            $(this).find('.bui_combobox_node').eq(0).addClass('active');
          } else {
            results.splice(resIndex, 1);
            inputText.find('.bui_combobox_tag').eq(resIndex).remove();
            if(results.length === 0){
              inputText.addClass('placeholder');
              inputText.text(opt.placeholder);
            }
            $(this).find('.bui_combobox_node').eq(0).removeClass('active');
          }
        } else {
          var resIndex = $.inArray(itemValue, results);
          if(resIndex === -1) {
            results = [itemValue];
            inputText.removeClass('placeholder');
            inputText.text(itemName);
          } else {
            results.splice(resIndex, 1);
            inputText.addClass('placeholder');
            inputText.text(opt.placeholder);
          }
          $(this).find('.bui_combobox_node').eq(0).addClass('active');
          $(this).siblings().find('.bui_combobox_node').eq(0).removeClass('active');
        }
        input.attr('value', results.join(','));
        if(opt.onChange instanceof Function){
          opt.onChange(_get_selecteds(results, opt.options));
        }
      });

    });
  };
})(jQuery);