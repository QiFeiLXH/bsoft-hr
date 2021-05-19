import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const elVal = vnode.context.$route.meta.permission
    const permissionId = elVal instanceof String && [elVal] || elVal
    if (roles.permissions.length <= 0){
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      return
    }
    if (!roles.permissionList.includes(permissionId)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      return
    }
    roles.permissions.forEach(p => {
      if (permissionId === p.permissionId) {
        if (!p.actionList.includes(actionName)) {
          el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
        }
      }
    })
  }
})

/**
 * watermark 水印指令
 * 指令用法：
 * <a-table
 *    v-watermark
 * >
 * </a-table>
 * @type {DirectiveOptions}
 */
const watermark = Vue.directive('watermark',(el)=>{
  function addWaterMarker(str){// 水印文字，父元素，字体，文字颜色
    var can = document.createElement('canvas');
    can.width = 80;
    can.height = 60;
    can.style.display = 'none';
    var cans = can.getContext('2d');
    cans.rotate(-20 * Math.PI / 180);
    cans.font = "normal bold 18px 宋体";
    cans.fillStyle = "rgb(240,240,240)";
    cans.textAlign = 'left';
    cans.textBaseline = 'Middle';
    cans.fillText(str, can.width / 8, can.height / 2);
    el.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  }
  addWaterMarker(store.getters.userInfo.personId)
})

const selfmark = Vue.directive('selfmark',{
  inserted: function (el,binding,vnode){//默认设置
    let defaultSettings={
      watermark_txt:"text",
      watermark_x:20,//水印起始位置x轴坐标
      watermark_y:20,//水印起始位置Y轴坐标
      watermark_rows:0,//水印行数
      watermark_cols:0,//水印列数
      watermark_x_space:10,//水印x轴间隔
      watermark_y_space:10,//水印y轴间隔
      watermark_color:'rgb(205, 220, 220)',//水印字体颜色
      watermark_alpha:0.4,//水印透明度
      watermark_fontsize:'18px',//水印字体大小
      watermark_font:'normal bold 18px 宋体',//水印字体
      watermark_width:90,//水印宽度
      watermark_height:40,//水印长度
      watermark_angle:15//水印倾斜度数
    };

    Object.assign(defaultSettings, binding.value);
    let oTemp = document.createDocumentFragment();

    //获取页面最大宽度
    let p_width = Math.max(document.body.scrollWidth,document.body.clientWidth);
    let cutWidth = p_width*0.0150;
    let page_width=p_width-cutWidth;
    //获取页面最大高度
    let page_height = Math.max(document.body.scrollHeight,document.body.clientHeight);
    // let page_height = document.body.scrollHeight+document.body.scrollTop;
    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width *defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
      defaultSettings.watermark_cols = parseInt((page_width-defaultSettings.watermark_x+defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
      defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
      defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
      defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
    }
    let x;
    let y;
    for (let i = 0; i < defaultSettings.watermark_rows; i++) {
      y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
      for (let j = 0; j < defaultSettings.watermark_cols; j++) {
        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

        let mask_div = document.createElement('div');
        mask_div.id = 'mask_div' + i + j;
        mask_div.className = 'mask_div';
        mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
        //设置水印div倾斜显示
        mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.visibility = "";
        mask_div.style.position = "absolute";
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = "hidden";
        mask_div.style.zIndex = "9999";
        mask_div.style.pointerEvents='none';//pointer-events:none  让水印不遮挡页面的点击事件
        mask_div.style.opacity = defaultSettings.watermark_alpha;
        mask_div.style.fontSize = defaultSettings.watermark_fontsize;
        mask_div.style.fontFamily = defaultSettings.watermark_font;
        mask_div.style.color = defaultSettings.watermark_color;
        mask_div.style.textAlign = "center";
        mask_div.style.width = defaultSettings.watermark_width + 'px';
        mask_div.style.height = defaultSettings.watermark_height + 'px';
        mask_div.style.display = "block";
        mask_div.style.font = "normal bold 18px 宋体"
        oTemp.appendChild(mask_div);
      }
    }
    el.appendChild(oTemp);
}}
)

const preventReClick = Vue.directive('preventReClick', {
  inserted: function (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 2000)
      }
    })
  }
})

const throttling = Vue.directive('throttling', {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted: function(el, binding) {
    const { callback, time } = binding.value
    el.callback = callback
    el.time = time
    el.addEventListener('click', () => {
      const nowTime = new Date().getTime()
      if (!el.preTime || nowTime - el.preTime > el.time) {
        el.preTime = nowTime
        el.callback()
      }
    })
  },
  update: function(el, binding) {
    console.log('update')
    const { callback, time } = binding.value
    el.callback = callback
    el.time = time
  }
})

const antiShake = Vue.directive('antiShake', {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  /**
   * el 指令所绑定的元素，可以用来直接操作 DOM 。
   * binding 一个对象，包含绑定的值
   */

  inserted: function(el, binding) {
    const { callback, time } = binding.value
    el.callback = callback
    el.time = time
    el.timeCall = null
    el.addEventListener('click', () => {
      clearTimeout(el.timeCall)
      el.timeCall = setTimeout(() => {
        el.callback()
      }, el.time || 500)
    })
  },
  // 所在组件的 VNode 更新时调用
  update: function(el, binding) {
    const { callback, time } = binding.value
    el.callback = callback
    el.time = time
  },
})


export default { action,watermark,selfmark,preventReClick,throttling,antiShake}
