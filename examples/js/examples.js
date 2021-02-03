$(window).ready(function(){
  $('.js-combox1').combobox({
    initValue: ['123','4456'],
    options: [
      {
        value: '1',
        name: '选项一',
        children: [
          {
            value: '1-1',
            name: '选项一',
            children: [
              {
                value: '1-1',
                name: '选项一',
              },
              {
                value: '1-1',
                name: '选项二',
              }
            ],
          },
          {
            value: '1-1',
            name: '选项二',
          }
        ]
      },
      {
        value: '2',
        name: '选项二',
      }
    ],
  });
  $('.js-combox2').combobox({
    multiselect: true,
    initValue: ['123','4456'],
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