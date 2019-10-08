+function ($) {

  //常用正则表达式
  var RegExps = {
    verifyCode: {
      reg: /^[0-9a-zA-Z]{4}$/,//验证码 4位数字字符
      errmsg: '验证码格式不正确'
    },
    name: {
      reg: /^.{1,20}$/,//姓名 包括1-20个字符
      errmsg: '姓名格式不正确'
    },
    phone: {
      reg: /^1[3|5|7|8|9]\d{9}$/,//移动电话号码 包括13、15、17、18、19开头的11位数字
      errmsg: '电话号码格式不正确'
    },
    email: {
      reg: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      errmsg: '邮箱格式不正确'
    },
    userName: /^[\w|\d]{6,16}$/,//用户名 包括1-16位字符和数字
    password: /^[\w!@#$%^&*.]{6,16}$/
  }

  //输入框限制函数
  var limit = {
    'pageNumber': function (value) {
      //   /[^1-9]/g  非1-9
      //   /\D/g 非数字
      if (value.length == 1) {//第一位不可以是0
        return value.replace(/[^1-9]/g, '');
      } else {
        return value.replace(/\D/g, '');
      }
    },
    'userName': function (value) {
      return value.replace(/[^\w+$]/g, '').substring(0, 15);
    },
    'phone': function (value) {
      return value.replace(/\D/g, '').substring(0, 11);
      // return value.replace(/[^\w&-]|_/ig,'').substring(0,11);
    },
    'verify': function (value) {
      return value.replace(/[\W]/g, '').substring(0, 4);
    }
  }

  //验证函数
  var validation = {
    //非空 = 必填
    require: function (v) {
      return (v.trim() == '') ? false : true;
    },
    //自定义正则
    custom: function (v, reg) {
      return reg.test(v);
    },
    //和什么相等
    equal: function (v, id) {
      var target = document.getElementById(id);
      console.log("当前控件的值:", v, "   目标控件的值:", target.value);
      return (target.value != v) ? false : true;
    }
  }

  function Validator(form) {
    var _this = this;
    this.$from = form;
    this.$validateEles = form.find("input[type='text'],textarea");
    this.$submitBtn = form.find('button');

    this.init = function () {
      var _from = this.$from;
      this.$submitBtn.click(function (event) {
        // event.stopPropagation();
        // event.preventDefault();

        var result = _this.checkAll();
        if (result) {
          console.log('验证全部通过');
          console.log(_from.formSerialize());
          _from.ajaxSubmit({
            type: "post",
            url: _from.attr('action'),
            success: function (data) {
              alert(data.info);
              if (data.status === 1) {
                window.location.reload();
              }
            }
          })
        }
      });

      //添加输入限制
      this.$validateEles.each(function (i, ele) {

        ele.onfocus = function (event) {
          //设置错误信息为空
          $(this).next().html('');
        }

        //添加实时输入限制
        var lmt = $(ele).data()['now'];
        if (lmt) {
          ele['now'] = lmt;
          var name = lmt.substring(0, 7);//str.substring(indexStart[,indexEnd])
          var num = lmt.slice(8, -1);//str.slice(beginSlice[,endSlice]);
          $(ele).bind('input propertychange', function () {
            this.value = limit[name](this.value, num);
          });
        }

        //解析验证类型和验证规则
        var validates = [];
        ele['validates'] = validates;
        if ($(ele).data()['validate']) {
          var errmsg = $(ele).data()['errmsg'].split('/');
          $(ele).data()['validate'].split(',').forEach(function (currentValue, index, array) {
            //console.log(currentValue,index,array);
            if (currentValue === 'require') {
              validates.push({
                "type": "require",
                "errmsg": errmsg[index]
              });
            } else if (currentValue.substring(0, 6) === 'custom') {//正则
              validates.push({
                "type": "custom",
                "reg": RegExps[currentValue.slice(7, -1)]['reg'],
                "errmsg": errmsg[index] || RegExps[currentValue.slice(7, -1)]['errmsg']
              });
            }
          });
        }
        //console.log(ele,ele['validates']);
      });
    }

    this.checkAll = function () {
      var result = false;
      this.$validateEles.each(function (i, ele) {
        ele['validates'].every(function (currentValue, index, array) {
          console.log(currentValue, ele.value);
          result = check(currentValue, ele.value);
          console.log(result, currentValue['errmsg']);
          if (!result) {
            $(ele).next().html(currentValue['errmsg']);
          }
          return result;
        });
        return result;
      });
      return result;
    }

    function check(validate, value) {
      if (validate['type'] === 'require') {
        return validation['require'](value);
      } else if (validate['type'] === 'custom') {
        return validation['custom'](value, validate['reg'])
      }
      return true;
    }
  }

  $(window).on('load', function () {
    $('form').each(function () {
      var $form = $(this);
      var validator = new Validator($form);
      validator.init();
    })
  });

}(jQuery);
