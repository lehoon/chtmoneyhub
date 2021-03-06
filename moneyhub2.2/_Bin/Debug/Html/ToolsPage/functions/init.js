Tesy.init = function(){
    Tesy.util.buildCalendar(Tesy.dom.$('calendar'));
    Tesy.util.resizeWindow();
    Tesy.util.enableEvent();
    Tesy.uEvents.init();
    Tesy.renderAlarm();
};

Tesy.util = {};

Tesy.util.buildCalendar = function(o){
    Tesy.calendar = new Tesy.Calendar(o);
    
    Tesy.calendar.ajHeight = function(){
        var sumHeight = (Tesy.dom.$('calt').offsetHeight + Tesy.dom.$('c_head').offsetHeight);
        var ccalendar = Tesy.dom.$('c_body');
        if (document.body.offsetHeight >= 200) {
            ccalendar.style.height = (document.body.offsetHeight - sumHeight) + "px";
        }
        else {
            ccalendar.style.height = 200 + 'px';
        }
    };
    Tesy.calendar.makeCalendar();
    Tesy.calendar.ajHeight();
    
    var gtoday = Tesy.dom.$('gtoday');
    gtoday.onclick = function(){
        var date = new Date();
        Tesy.calendar.makeCalendar(date.getFullYear(), date.getMonth());
        Tesy.uEvents.init();
        Tesy.util.enableEvent();
    }
};

Tesy.util.resizeWindow = function(){
    window.onresize = function(){
        Tesy.util.resizeuEvents();
        if (typeof Tesy.timer === "undefined") {
            Tesy.timer = setTimeout(function(){
                Tesy.calendar.ajHeight();
                Tesy.uEvents.init();
                Tesy.util.resizeAlarm();
            }, '300');
        }
        else {
            clearTimeout(Tesy.timer);
            Tesy.timer = setTimeout(function(){
                Tesy.calendar.ajHeight();
                Tesy.uEvents.init();
                Tesy.util.resizeAlarm();
            }, '300');
        }
    };
};

Tesy.util.resizeAlarm = function(){
    var ltop = 40;
    var iframeHeight = 110;
    var alermlist = Tesy.dom.$('alarmlist');
    var iframeDiv = Tesy.dom.$('ifdiv');
    
    if (!iframeDiv.innerHTML) {
        iframeDiv.innerHTML = '<iframe src="ad/ad.html" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
    }
    alermlist.style.height = document.body.offsetHeight - ltop - iframeHeight + 'px';
};

Tesy.util.resizeuEvents = function(){
    var oNode = Tesy.dom.$('layday');
    if (oNode) {
        oNode.parentNode.removeChild(oNode);
    }
}


Tesy.util.enableEvent = function(){
    var trigger = Tesy.dom.$('eventButton');									// 本月日子集合
	var darray = Tesy.dom.getElemsByClass(Tesy.dom.$('c_body'), 'day'); 
	
    trigger.onclick = function(){
		//点击“添加事件”，弹出内容输入层。
        if (typeof Tesy.eventlay == 'undefined') {
            Tesy.eventlay = new Tesy.EventLay();
        }
        Tesy.eventlay.init();
    };
    
    for (var i = 0, l = darray.length; i < l; ++i) {
        darray[i].onclick = (function(targetDom){
            return function(){
				//点击本月日期，添加事件，弹出内容输入层。
	            var evt_ly = Tesy.dom.$("evt_ly");
	            if (evt_ly.style.display == "none") {
	                var lay = Tesy.dom.$('minicalendar');
	                
					var sdate = targetDom.getAttribute('date');
	                
	                if (typeof Tesy.eventlay == 'undefined') {
	                    Tesy.eventlay = new Tesy.EventLay();
	                }
	                Tesy.eventlay.init(sdate);
	                Tesy.eventlay.caculateDay();
	                lay.style.display = 'none';
	            }
            }
        })(darray[i])
    }
};

Tesy.renderAlarm = function(){
    Tesy.util.resizeAlarm();
    
    var list = Tesy.interact.getTodayAlarms();
    var container = Tesy.dom.$('alarmlist');
    var noticelist = [];
    
    var renderitem = function(i, state){
        var single = Tesy.dom.cE('li');
        var content = Tesy.dom.cE('div');
        var operation = Tesy.dom.cE('span');
        var datec = Tesy.dom.cE('span');
        var ctc = Tesy.dom.cE('span');
        var leftd = Tesy.dom.cE('span');
        var ign_alarm = Tesy.dom.cE('span');
        var bck_alarm = Tesy.dom.cE('span');
        var notice_alarm = Tesy.dom.cE('span');
        
        ign_alarm.title = '暂停提醒';
        bck_alarm.title = '停止提醒';
        notice_alarm.title = '重新提醒';
        
        var adate = (list[i].event_date).split('-');
        var date = new Date(adate[0], adate[1] - 1, adate[2]);
        var now = new Date();
        var d = date - now;
        
        if (d < 0 && d >= -86400000) {
            single.className = 'today';
            leftd.innerHTML = '今天';
        }
        else 
            if (d > 0) {
                single.className = 'not_yet';
                leftd.innerHTML = '还剩' + Math.floor((d / 86400000) + 1) + '天';
            }
            else 
                if (d < -86400000) {
                    return true;
                }
        
        if (list[i].status == 0 || list[i].status == 2) {
            single.className = 'notice';
        }
        
        ctc.innerHTML = list[i].description;
        datec.innerHTML = (((list[i].event_date).replace(/^\d+-/, '')).replace('-', '月')) + '日';
        
        content.className = 'event_c';
        operation.className = 'event_op';
        datec.className = 'date';
        ctc.className = 'ctt';
        leftd.className = 'rmd';
//        ign_alarm.className = 'btn1';
        bck_alarm.className = 'btn2';
        notice_alarm.className = 'btn3';
        
//        ign_alarm.onclick = function(){
//            Tesy.interact.setAlerm(list[i].id, 2, list[i].type);
//            Tesy.renderAlarm();
//        }
        
        bck_alarm.onclick = function(){
            Tesy.interact.setAlerm(list[i].id, 0, list[i].type);
            Tesy.renderAlarm();
        }
        
        notice_alarm.onclick = function(){
            Tesy.interact.setAlerm(list[i].id, 1, list[i].type);
            Tesy.renderAlarm();
        }
        
        content.appendChild(datec);
        content.appendChild(ctc);
        content.appendChild(leftd);
//        operation.appendChild(ign_alarm);
        operation.appendChild(bck_alarm);
        operation.appendChild(notice_alarm);
        single.appendChild(content);
        single.appendChild(operation);
        container.appendChild(single);
    };
    
    container.innerHTML = '';
    
	for (var i = 0, l = list.length; i < l; ++i) {
        /*
		if (list[i].status == 0) {
            noticelist.push(i);
            continue;
        }
        */
        renderitem(i);
    }
    /*
    for (var j = 0, n = noticelist.length; j < n; j++) {
        renderitem(noticelist[j]);
    }
    */
};

Tesy.uEvents = {

    clearuEvents: function(){
        var evtWrap;
        var dList = Tesy.calendar.dList;
        for (var j = 0, m = dList.length; j < m; ++j) {
            evtWrap = Tesy.calendar.evtWrapList[j];
            evtWrap.innerHTML = '';
            evtWrap.className = 'eventWrap';
            Tesy.uEvents.delMore(j);
            dList[j].setAttribute('disp_num', 0);
            dList[j].setAttribute('sum_num', 0);
            dList[j].appendChild(evtWrap);
        }
    },
    
    addMore: function(n){
    
        var dList = Tesy.calendar.dList;
        var moreParent = Tesy.dom.fNode(dList[n], "div", "clear")[0];
        var topParent = moreParent.parentNode;
        var dmore = Tesy.dom.fNode(moreParent, "a", "more")[0];
        
        topParent.setAttribute('ListOrder', n);
        if (typeof dmore == 'undefined') {
            tmore = Tesy.dom.cE('a');
            tmore.innerHTML = "更多";
            tmore.href = "javascript:;";
            tmore.className = 'more';
            moreParent.appendChild(tmore);
            tmore.onclick = (function(oNode){
                return function(e){
                    Tesy.event.stopBubble(e);
                    Tesy.uEvents.initMore(oNode);
                };
            })(moreParent.parentNode);
        }
    },
    
    delMore: function(n){
        var dList = Tesy.calendar.dList;
        var moreParent = Tesy.dom.fNode(dList[n], "div", "clear")[0];
        var dmore = Tesy.dom.fNode(moreParent, "a", "more")[0];
        if (typeof dmore != 'undefined') {
            dmore.parentNode.removeChild(dmore);
        }
    },
    
	fixHeight : function(oNode,sHeight){
		var Y = Tesy.dom.getY(oNode);
		var sH = Tesy.dom._('html')[0].offsetHeight;
		var rH = oNode.offsetHeight;
		var mH = rH - sHeight;

		if(rH > (sH - Y )){
			oNode.style.top = Y - mH + 1 + 'px';
		}
	},

    renderOne: function(oNode, odata){
        var content = odata.description;
        var wrapinner = Tesy.dom.cE('div');
        var wrapself = Tesy.dom.cE('div');
        var wrapouter = Tesy.dom.cE('div');
        
        wrapinner.innerHTML = content;
        wrapinner.className = 'evt_cc';
        wrapself.className = 'evt_c2';
        wrapouter.className = 'evt_c1';
        
        wrapself.appendChild(wrapinner);
        wrapouter.appendChild(wrapself);
        
        wrapinner.id = odata.id;
        wrapinner.onclick = (function(item){
            return function(e){
				//编辑事件 动作
                Tesy.event.stopBubble(e);
                if (typeof Tesy.eventlay == 'undefined') {
                    Tesy.eventlay = new Tesy.EventLay();
                }
                Tesy.eventlay.init(item);
            }
        })(odata)
        
        oNode.appendChild(wrapouter);
    },
    
    rendDay: function(oNode, oArr){
        var l = oArr.length;
        for (var i = 0; i < l; ++i) {
            Tesy.uEvents.renderOne(oNode, oArr[i]);
        }
    },
    
    initMore: function(oNode){
        if (Tesy.dom.$('layday')) {
            var exsitNode = Tesy.dom.$('layday');
            exsitNode.parentNode.removeChild(exsitNode);
        }
        var dateString = oNode.getAttribute('date');
        var dateArr = dateString.split('-');
        var list = Tesy.interact.getEventsByDay(dateArr[0], dateArr[1], dateArr[2]);
        var thisNode = oNode.cloneNode(true);
        var position = Tesy.dom.getPosition(oNode);
        var moreNode = Tesy.dom.fNode(thisNode, "a", 'more')[0];
        var eventWrap = Tesy.dom.fNode(thisNode, "div", 'eventWrap')[0];
        var disp_num = thisNode.getAttribute('disp_num');
        
        if (list.length <= disp_num) {
            thisNode.parentNode.removeChild(thisNode);
            return false;
        }
        
		Tesy.event.addEventListener(thisNode,'mouseout',function(event){
			var toEl = Tesy.event.getEventTo(event);
			var isChild = Tesy.dom.isChild(toEl,thisNode);

			if(!isChild && toEl != thisNode && thisNode.parentNode){
				setTimeout(function(){
					
					thisNode.parentNode.removeChild(thisNode);
				},500)
			}
		});
		
        moreNode.parentNode.removeChild(moreNode);
        
        eventWrap.innerHTML = "";
        thisNode.id = "layday";
        Tesy.dom.addClass(thisNode, "layday");
        thisNode.style.left = position[0] - 1 + "px";
        thisNode.style.top = position[1] - 1 + "px";
		thisNode.style.width = oNode.offsetWidth + "px";
        
        Tesy.uEvents.rendDay(eventWrap, list);
		thisNode.style.visible = 'hidden';
        document.body.appendChild(thisNode);
		Tesy.uEvents.fixHeight(thisNode,oNode.offsetHeight);
		thisNode.style.visible = '';
    },
    
    init: function(){
        Tesy.uEvents.clearuEvents();
        
        var iyear = Tesy.calendar.thisYear;
        var imonth = Tesy.calendar.thisMonth + 1;
        var list = Tesy.interact.getEventList(iyear, imonth);
        var dList = Tesy.calendar.dList;
        var layday = Tesy.dom.$('layday');
        var inum;
        
        function getOrder(str){
            var dateArr = str.split('-');
            var date = new Date(dateArr[0], dateArr[1]-1, dateArr[2]);
            return (date.getDate() - 1);
        }
        
        if ((Tesy.dom.getHeight(dList[0]) - 18) < 22) {
            inum = 0;
        }
        else {
            inum = Math.floor((Tesy.dom.getHeight(dList[0]) - 20) / 21);
        }
        
        for (var i = 0, l = list.length; i < l; ++i) {
            var order = getOrder(list[i].event_date);
            var evtWrap = Tesy.calendar.evtWrapList[order];
            var disp_num = dList[order].getAttribute('disp_num');
            var sum_num = dList[order].getAttribute('sum_num');
            
            if (disp_num >= inum) {
                sum_num++;
                dList[order].setAttribute("sum_num", sum_num);
                Tesy.uEvents.addMore(order);
                continue;
            }
            
            disp_num++;
            sum_num++;
            dList[order].setAttribute('disp_num', disp_num);
            dList[order].setAttribute("sum_num", sum_num);
            Tesy.uEvents.renderOne(evtWrap, list[i]);
        }
        
        if (layday) {
            var dateStr = layday.getAttribute('date');
            var order = getOrder(dateStr);
            Tesy.uEvents.initMore(dList[order]);
        }
    }
}

Tesy.EventLay = function(){}
Tesy.EventLay.prototype = {
    init: function(obj){
        this.wrap = Tesy.dom.$('evt_ly');
        this.cover = Tesy.dom.$('scover');
        this.wrap.style.display = '';
		
		Tesy.dom.$('eventct').focus();
		//document.getElementById('eventct').focus(); 
				
		this.cover.style.display = '';
        
        if (typeof obj == 'undefined') {
            this.eventid = false;
            this.initDateSeletor();
            this.initRadio();
            this.initSeletor(3);
            this.initInput();
            this.initOperation();
        }
        else 
            if (typeof obj == 'string') {
                this.eventid = false;
                this.initDateSeletor(obj);
                this.initRadio();
                this.initSeletor();
                this.initInput();
                this.initOperation();
            }
            else 
                if (typeof obj == 'object') {
                    this.eventid = obj.id;
                    this.initDateSeletor(obj.start_date);
                    this.initRadio(obj.repeat);
                    this.initSeletor(obj.alarm);
                    this.initInput(obj.description);
                    this.initOperation(obj);
                }
        this.caculateDay();
		
    },
    
    initDateSeletor: function(sdate){
    
        if (sdate) {
            var date = Tesy.date.stringToDate(sdate);
            this.sdate = sdate;
        }
        else {
            var date = new Date();
        }
        
        var month = date.getMonth();
        var year = date.getFullYear();
        var day = date.getDate();
        var screem = Tesy.dom.$('dateselect');
        var calLay = Tesy.dom.$('minicalendar');
        var miniwrap = Tesy.dom.$("minical");
        
        screem.innerHTML = year + '年' + (month + 1) + '月' + day + '日';
        screem.setAttribute('date', year + '-' + (month + 1) + '-' + day);
        
        if (typeof calSelector != "undefined") {
            if (typeof sdate == 'undefined') {
                calSelector.makeCalendar();
            }
            else {
                calSelector.makeCalendar(year, month, day);
            }
        }
        
        screem.onclick = (function(thisdom){
            return function(){
                var sdate = thisdom.getAttribute('date');
                var date = Tesy.date.stringToDate(sdate);
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var calLay = Tesy.dom.$('minicalendar');
                var miniwrap = Tesy.dom.$("minical");
                
                if (typeof calSelector === "undefined") {
                    calSelector = new Tesy.miniCalendar(miniwrap);
                }
                
                calSelector.makeCalendar(year, month, day);
                
                if (calLay.style.display == 'none') {
                    calLay.style.display = '';
                }
            };
        })(screem);
    },
    
    initRadio: function(state){
        var wrap = Tesy.dom.$('eradio');
        var lis = wrap.getElementsByTagName('li');
        
		var setRadio = function(n){
			var wrap = Tesy.dom.$('eradio');
			var lis = wrap.getElementsByTagName('li');
			var l = lis.length;
			for(var i = 0; i < l; i++){
				lis[i].className = '';
			}
			lis[n].className = 'cur';
		}
		
		var setValue = function(n){
			var wrap = Tesy.dom.$('eradio');
			wrap.setAttribute('status',n);
		}
		
		var radioTo = function(n){
			switch(n){
				case 0 :
					setRadio(0);
					setValue(1);
					Tesy.eventlay.setrmDayLimit(3);
					break;
				case 1 :
					setRadio(1);
					setValue(2);
					Tesy.eventlay.setrmDayLimit(10);
					break;
				case 2 :
					setRadio(2);
					setValue(3);
					Tesy.eventlay.setrmDayLimit(10);
					break;
				case 3 :
					setRadio(3);
					setValue(4);
					Tesy.eventlay.setrmDayLimit(10);
					break;
				case 4 :
					setRadio(4);
					setValue(0);
					Tesy.eventlay.setrmDayLimit(30);
					break;
			}
		};
		
		var stateTo = function(state){
			switch(state){
				case 1 :
					setRadio(0);
					setValue(1);
					Tesy.eventlay.setrmDayLimit(3);
					break;
				case 2 :
					setRadio(1);
					setValue(2);
					Tesy.eventlay.setrmDayLimit(10);
					break;
				case 3 :
					setRadio(2);
					setValue(3);
					Tesy.eventlay.setrmDayLimit(10);
					break;
				case 4 :
					setRadio(3);
					setValue(4);
					Tesy.eventlay.setrmDayLimit(10);
					break;
				case 0 :
					setRadio(4);
					setValue(0);
					Tesy.eventlay.setrmDayLimit(30);
					break;
			}
		};
		
        for (var i = 0, l = lis.length; i < l; ++i) {
            lis[i].className = '';
            lis[i].onclick = (function(n){
                return function(){
                    radioTo(n);
                    Tesy.eventlay.caculateDay();
                }
            })(i)
        }
        
        if (typeof state != 'undefined') {
			stateTo(state)
        }
        else {
			stateTo(2);
        }
    },
	
	setrmDayLimit : function(n){
        var screem = Tesy.dom.$('rmday');
		screem.setAttribute('limit',n);
		screem.setAttribute('status',3);
		screem.innerHTML = 3;
	},
	
    initSeletor: function(state){
        var screem = Tesy.dom.$('rmday'),
			up = Tesy.dom.$('rmup'),
			down = Tesy.dom.$('rmdown');
		
		var setState = function(state){
			screem.innerHTML = state;
			screem.setAttribute('status',state);
		};
		
		var getState = function(){
			return parseInt(screem.getAttribute('status'));
		};
		
		var getLimit = function(){
			return parseInt(screem.getAttribute('limit'));
		};
		
		var numUp = function(){
			var l = getLimit(),
				n = getState();
			if( n > 0 && n < l){
				setState(getState()+1);
			}
		};
		
		var numDown = function(){
			var l = getLimit(),
				n = getState();
			if( n > 1 && n <= l){
				setState(getState()-1);
			}
		};
		
		up.onclick = numUp;
		down.onclick = numDown;
		if(typeof state !== 'undefined'){
			setState(state);
		}
    },
    
    initInput: function(text){
        var input = Tesy.dom.$('eventct');
        if (text) {
            input.value = text;
        }
        else {
            input.value = '';
        }
    },
    
    initOperation: function(obj){
        var delLi = Tesy.dom.cE('li');
        var saveLi = Tesy.dom.cE('li');
        var cancelLi = Tesy.dom.cE('li');
        var delSpan = Tesy.dom.cE('span');
        var saveSpan = Tesy.dom.cE('span');
        var cancelSpan = Tesy.dom.cE('span');
        var container = Tesy.dom.$('oplist');
        var eventId = obj ? obj.id : '';
        var tipwrap = Tesy.dom.$('tipwrap');
        
        container.innerHTML = '';
        tipwrap.style.display = "none";
        delSpan.className = 'del_btn';
        saveSpan.className = 'save_btn';
        cancelSpan.className = 'cancel_btn';
        delLi.appendChild(delSpan);
        saveLi.appendChild(saveSpan);
        cancelLi.appendChild(cancelSpan);
        
        cancelSpan.onclick = function(){
            Tesy.eventlay.cancelEvent();
        }
        
        saveSpan.onclick = function(){
            Tesy.eventlay.saveEvent();
		}
        
        if (!obj) {
            container.appendChild(saveLi);
            container.appendChild(cancelLi);
        }
        else {
            delLi.onclick = (function(id){
                return function(){
                    Tesy.eventlay.initPop("02");
                }
            })(eventId)
            
            saveSpan.onclick = (function(obj){
                return function(){
                    Tesy.eventlay.saveEvent(obj);
                }
            })(obj);
            
            container.appendChild(delLi);
            container.appendChild(saveLi);
            container.appendChild(cancelLi);
        }
    },
    
    initPop: function(state){
        var cfg = {
            "01": {
                text: "请您输入事件内容后保存..",
                option: 1
            },
            "02": {
                text: "您确定要删除该事件？",
                option: 2
            },
            "03": {
                text: "抱歉，事件字数不能超过30",
                option: 1
            },
            "04": {
                text: "抱歉，单天事件不能超过10个",
                option: 1
            }
        }
        
        var tipwrap = Tesy.dom.$('tipwrap');
        var ctt = Tesy.dom.getElemsByClass(tipwrap, 'mtctt')[0];
        var opli = Tesy.dom.$('tipop');
        var yeswrap = Tesy.dom.cE('li');
        var nowrap = Tesy.dom.cE('li');
        var yesbtn = Tesy.dom.cE('span');
        var nobtn = Tesy.dom.cE('span');
        
        yesbtn.className = "yes_btn";
        nobtn.className = "cancel_btn";
        
        yesbtn.onclick = (function(cfg){
            return function(){
                var tipwrap = Tesy.dom.$('tipwrap');
                if (cfg.option == 1) {
                    tipwrap.style.display = "none";
                }
                else {
                    tipwrap.style.display = "none";
                    Tesy.eventlay.delEvent(Tesy.eventlay.eventid);
                }
            }
        })(cfg[state]);
        
        nobtn.onclick = function(){
            var tipwrap = Tesy.dom.$('tipwrap');
            tipwrap.style.display = "none";
        }
        
        yeswrap.appendChild(yesbtn);
        nowrap.appendChild(nobtn);
        
        opli.innerHTML = "";
        tipwrap.style.display = "";
        ctt.innerHTML = cfg[state]["text"];
        
        opli.appendChild(yeswrap);
        if (cfg[state]["option"] == 2) {
            opli.appendChild(nowrap);
        }
    },
    
    caculateDay: function(){
        var date = Tesy.date.stringToDate(Tesy.dom.$('dateselect').getAttribute('date'));
		var tyear = date.getFullYear();
		var tmonth = date.getMonth();
		var tday = date.getDate();
        var methodstatus = Math.ceil(Tesy.dom.$('eradio').getAttribute('status'));
        var target = Tesy.dom.$('evthappen');
        var resultString;
		var t = new Date();
		var today = new Date(t.getFullYear(),t.getMonth(),t.getDate());
		var thatday = date;
        
        switch (methodstatus) {
            case 1:
				while(date < today){
					tday += 7;
					date = new Date(tyear,tmonth,tday);
				}
                break;
            case 2:
				while(date < today){
					tmonth += 1;
					date = new Date(tyear,tmonth,tday);
				}
                if (tday > date.getDate()) {
                    tmonth++
               		date = new Date(tyear, tmonth, 0);
                }
                break;
            case 3:
				while(date < today){
					tmonth += 3;
					date = new Date(tyear,tmonth,tday);
				}
                if (tday > date.getDate()) {
                    tmonth += 1;
               		date = new Date(tyear, tmonth, 0);
                }
                break;
            case 4:
				while(date < today){
					tyear += 1;
					date = new Date(tyear,tmonth,tday);
				}
                if (tday > date.getDate()) {
                    date = new Date(tyear, tmonth + 1, 0);
                }
                break;
            case 0:
                break;
        }
        resultString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        target.innerHTML = resultString;
    },
    cancelEvent: function(){
        this.init();
        this.cover.style.display = 'none';
        this.wrap.style.display = 'none';
    },
    saveEvent: function(obj){
    
        var str = Tesy.dom.$('eventct').value;
        var regex = new RegExp(/[^\s]+/g);
        var date = Tesy.dom.$('dateselect').getAttribute('date');
        var dateArr = date.split("-");
        var sum_num = Tesy.calendar.dList[Math.ceil(dateArr[2]) - 1].getAttribute('sum_num');
		
		var checkData = (function(){
			if (!regex.test(str)) {
	            Tesy.eventlay.initPop("01");
	            return false;
	        }else if (str.length > 30) {
                Tesy.eventlay.initPop("03");
                return false;
            }else if (sum_num > 9 && (typeof obj) === 'undefined') {
                Tesy.eventlay.initPop("04");
                return false;
            }

			str = str.match(regex).join(" ");
			return str;
		})();
        
		if(!checkData){
			return false;
		}
		
        Tesy.dom.$('eventct').value = str;
		
        if (typeof obj != 'undefined') {
            var oObj = obj;
        }
        else {
            var oObj = {};
            oObj.id = 0;
            oObj.status = 1;
        }
        
        oObj.event_date = date;
        oObj.description = str;
        oObj.repeat = Tesy.dom.$('eradio').getAttribute('status');
        oObj.alarm = Tesy.dom.$('rmday').getAttribute('status');
        
        Tesy.interact.saveEvent(oObj);
        Tesy.uEvents.init();
        this.cancelEvent();
        Tesy.renderAlarm();
    },
    delEvent: function(eventId){
        Tesy.interact.delEvent(eventId);
        Tesy.uEvents.init();
        Tesy.renderAlarm();
        this.cancelEvent();
    }
}
