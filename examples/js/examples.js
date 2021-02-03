$(window).ready(function(){
  $('.js-combox1').combobox({
    value: ['1','1-1'],
    multiselect: true,
    options: [
      {
        value: '1',
        name: '选项1',
        children: [
          {
            value: '1-1',
            name: '选项1-1',
            children: [
              {
                value: '1-1-2',
                name: '选项1-1-2',
              },
              {
                value: '1-1-3',
                name: '选项1-1-3',
              }
            ],
          },
          {
            value: '1-2',
            name: '选项1-2',
          }
        ]
      },
      {
        value: '2',
        name: '选项2',
      }
    ],
  });
  $('.js-combox2').combobox({
    value: ['1'],
    options: [
      {
        value: '1',
        name: '选项一',
      },
      {
        value: '2',
        name: '选项二',
      }
    ],
    format: function(valus) {
      return $.map(valus, function(item){
        return '<span>'+ item +'</span>'
      }).join('');
    },
  });
});