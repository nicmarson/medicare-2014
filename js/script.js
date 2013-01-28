
$(function() {
	//setCookie('ZIP',"97217",90);
	
	var demographicsDataModel = new Demographics();
	demographicsDataModel = setDataModelValues(demographicsDataModel);
	
	$("#showZipCode").text(demographicsDataModel.zip);

	
	console.log(demographicsDataModel);
	//demographicsDataModel
	//alert(getCookie('test'));
	//alert(getCookie('foo'));
	//alert(getCookie());
//$('#demographicsModal').modal('show');
});

/***********************
*
* Data Model
*
***********************/

/***********
*	@name:			Demographics()
*	@description:	Build and setup Demographics data model
*
*	@param: 		N/A
*	@returns: 		true;
***********/
function Demographics(){
	this.exp = false;
	this.keepMe = false; 
	this.alreadyMedicare = false;
	this.coverage = false; // Coverage year
	this.planValue = false; // State identification
	this.county = false; // County name
	this.serviceArea = false; // Default will use planValue, otherwise will overwrite planValue
	this.zip = false; // Zip code
	this.age = false; // Age
	this.gender = false; // Gender
	this.plancode = false; // Asuris or non-asuris 
	this.state = false; // state identifier
	this.offerMedAdvantage = false;
	this.offerMedigap = false;
	return;
}

/***********
*	@name:			setDataModelValues()
*	@description:	Set Data Model Values from Cookies if the cookies Exist.
*
*	@param: 		(string) 		dataModel 	Data Model to Build Into
*
*	@returns: 		(string|false)	Requested Cookie Value
***********/
function setDataModelValues(dataModel){
	dataModel.zip = getCookie('ZIP');
	
	return dataModel;
	//   // set value to already Medicare field
	//   if ( $("input[name=onMedicare]").is(':checked') ) {
	//     $("input[name=onMedicare]").val('on');
	//     alreadyMedicare = 'on';
	//   } else {
	//     alreadyMedicare = 'off';
	//   }
// 	var cookieString = "{'zip':'" + zip + "','age':'" + age + "', 'state':'" + state + "', 'county':'" + county + "', 'serviceArea':'" + serviceArea + "', 'gender':'" + gender + "', 'offerMedAdvantage':'" + offerMedAdvantage + "', 'offerMedigap':'" + offerMedigap + "', 'coverage':'" + coverage + "', 'onMedicare':'" + alreadyMedicare + "', 'plancode':'" + plancode + "', 'rememberMe':'" + keepMe + "'}";
}

// Set the Cookie String Data
// function setCookieString() {
//   var exp;
//   var keepMe; 
//   var alreadyMedicare;
//   var coverage = $("input[name=coverage]:checked").val(); // Coverage year
//   var planValue = $.cookie("PLANCODE"); // State identification
//   var county = $("#counties").val(); // County name
//   var serviceArea = $("#serviceArea").val(); // Default will use planValue, otherwise will overwrite planValue
//   var zip = $("#ZipCode").val(); // Zip code
//   var age = $("#age").val(); // Age
//   var gender = $("#gender").val(); // Gender
//   var plancode = $("#plancode").val(); // Asuris or non-asuris 
//   var state = $("#state").val(); // state identifier
//   var offerMedAdvantage = $("#offerMedAdvantage").val();
//   var offerMedigap = $("#offerMedigap").val();
//   
//   // Remember user sets the expiration days of cookie
//   if ( $("input[name=keepMe]").is(':checked') ) {
//     exp = 90; // Remember user
//     $("input[name=keepMe]").val('on');
//     keepMe = 'on';
//   } else {
//     exp = 0; // Do not remember user
//     keepMe = 'off';
//   }
//   
//   // set value to already Medicare field
//   if ( $("input[name=onMedicare]").is(':checked') ) {
//     $("input[name=onMedicare]").val('on');
//     alreadyMedicare = 'on';
//   } else {
//     alreadyMedicare = 'off';
//   }
//   
//   
//   
//   // Demographics cookie
//   $.cookie("demographics", ( cookieString ), { path: '/', expires: exp });
//   
//   // Plancode coookie 
//   $.cookie("PLANCODE", ( planValue ), { path: '/', expires: exp });
//   
//   // SALO: the medigap pages are still using these cookies, annoying... 
//   // need to set them here to navigate from medAdvantage to medigap
//   var zip; var age; var gender;
//   zip = $('#ZipCode').val();
//   age = $('#age').val();
//   gender = $('#gender').val();
//   $.cookie('age0', ( age ), {path: '/', expires: 0});
//   $.cookie('ZIP', ( zip ), {path: '/', expires: 0});
//   $.cookie('gender0', ( gender ), {path: '/', expires: 0});
// }

/***********************
*
* Utilities
*
***********************/

/***********
*	@name:			getCookie()
*	@description:	Get Cookie
*
*	@param: 		(null|string) 		cookieName Cookie Name
*	@returns: 		(array) | (string|false)	Requested Cookie Value
***********/
function getCookie(cookieName){
	var i,x,y,ARRcookies=document.cookie.split(";");
	if(typeof(cookieName) == 'undefined'){
		return ARRcookies;
	}else{
		for (i=0;i<ARRcookies.length;i++)
		{
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
				if (x==cookieName)
				{
					return unescape(y);
				}
		}
		return false;
	}
}

/***********
*	@name:			setCookie()
*	@description:	Set Cookie
*
*	@param: 		(string) 		cookieName 	Cookie Name
*	@param: 		(string) 		cookieValue Cookie Value
*	@param: 		(int|null) 		exp 		Cookie Exp Days
*
*	@returns: 		(string|false)	Requested Cookie Value
***********/
function setCookie(cookieName, cookieValue, exp){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exp);
	var c_value=escape(cookieValue) + ((exp==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=cookieName + "=" + c_value + "; path=/";
}

// Possibly not used.
/***********
*	@name:			getCookie()
*	@description:	Get Cookie
*
*	@param: 		(string) 		cookieName Cookie Name
*	@returns: 		(string|false)	Requested Cookie Value
***********/
function checkCookie(cookieName){
	console.log(document.cookie);
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
			if (x==cookieName)
			{
				return unescape(y);
			}
	}
}

// function getCookie(c_name)
// {
// var i,x,y,ARRcookies=document.cookie.split(";");
// for (i=0;i<ARRcookies.length;i++)
// {
//   x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
//   y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
//   x=x.replace(/^\s+|\s+$/g,"");
//   if (x==c_name)
//     {
//     return unescape(y);
//     }
//   }
// }



// Our Javascript Calls

// $(function() {
// 			
// 	$('a.modalLink').colorbox({href: function(){$(this).attr('href');}, title: function(){$(this).attr('title');}, width: '500px', height: '500px'}, function() {
// 		$.colorbox.resize();
// 		$('#demogCancel').click(function() { $.colorbox.close();});
// 	});
// 	var zipCode = ($.cookie("ZIPCODE"));
// 	if(zipCode == '' || zipCode == null || zipCode == 'null' || isUndefined(zipCode)) {
// 		$.colorbox({
// 			href:'modals/enh_demographics.jsp', 
// 			title: 'Demographics', 
// 			width: '500px', 
// 			height: '550px', 
// 			overlayClose: false,
// 			escKey: false,
// 			onComplete:function(){ 
// 				showForm('medicareBasic'); // select basic Medicare form
// 				$("#demographicButton").val('Continue');
// 				$("#cboxClose").hide();
// 				setFormValues(); // Populate form values (based on cookie data)
// 				submitAction(); // Set submit() action to the form on click
// 				setFormSubmitHandler('/medicare/index.jsp', false, 'medicareBasic');
// 				$("#spinner").ajaxElement(); // want to show the spinner when fetching the county list
// 				zipShowCountyList();
// 			}
// 		});
// 	}
// 
// 	var leaveRegenceHTML = '<h2 style="color: #000; margin: 40px 30px;">You are about to leave the Regence Web site and enter another site that is NOT affiliated with or licensed by the Blue Cross Blue Shield Association.</h2><div style="position:absolute; left: 5%; bottom: 5%;"><a href="javascript:void(0)" id="leavingRetnBtn" class="button" style="border: 2px solid #71893f;background: #475c23; width: 100%;" title="Leave Regence"><span style="padding: 17px 12px;">Remain on Regence site</span></a></div><div style="position:absolute; right: 5%; bottom: 5%;"><a href="javascript:void(0)" id="leavingContBtn" class="button" style="border: 2px solid #71893f;background: #475c239; width: 100%;" title="Leave Regence"><span style="padding: 17px 12px;">Leave Regence</span></a></div>';
// 
// 	var planCode = ($.cookie("PLANCODE"));
// 	$('input.external-site').click(function() {
// 		var thisForm = $(this).parent();
// 		if(planCode == 'WA' || planCode == 'WARBS' || planCode == 'OR') {
// 			$.colorbox({
// 				html: leaveRegenceHTML, 
// 				title: '', 
// 				width: '500px', 
// 				height: '300px', 
// 				onComplete:function(){
// 					$('#cboxTitle').hide();
// 					$('#leavingContBtn').click( function() {
// 						$.colorbox.close();
// 						thisForm.submit();
// 					});
// 					$('#leavingRetnBtn').click( function() {
// 						$.colorbox.close();
// 					});
// 				}
// 			});
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	});
// 	$('a.external-site').click(function(e) {
// 		var thisLink = $(this).attr('href');
// 		if(planCode == 'WA' || planCode == 'WARBS' || planCode == 'OR') {
// 			$.colorbox({
// 				html: leaveRegenceHTML, 
// 				title: '', 
// 				width: '500px', 
// 				height: '300px', 
// 				onComplete:function(){
// 					$('#cboxTitle').hide();
// 					$('#leavingContBtn').click( function() {
// 						$.colorbox.close();
// 						window.open(thisLink);
// 					});
// 					$('#leavingRetnBtn').click( function() {
// 						$.colorbox.close();
// 					});
// 				}
// 			});
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	});
// 
// 	function isUndefined(x) {var u; return x === u;}
// 
// });

// angular.module('medicare', ['ui.bootstrap']);
// function AccordionDemoCtrl($scope) {
//   $scope.oneAtATime = true;
// 
//   $scope.groups = [
// 	{
// 	  title: "Dynamic Group Header - 1",
// 	  content: "Dynamic Group Body - 1"
// 	},
// 	{
// 	  title: "Dynamic Group Header - 2",
// 	  content: "Dynamic Group Body - 2"
// 	}
//   ];
// 
//   $scope.items = ['Item 1', 'Item 2', 'Item 3'];
// 
//   $scope.addItem = function() {
// 	$scope.items.push('Item ' + $scope.items.length);
//   };
// }
// 
// 
// function FormDialog($scope, $dialog){
// 
//   // Inlined template for demo
//   var t = '<div class="modal-header">'+
//           '<h1>This is the title</h1>'+
//           '</div>'+
//           '<div class="modal-body">'+
//           '<p>Enter a value to pass to <code>close</code> as the result: <input ng-model="result" /></p>'+
//           '</div>'+
//           '<div class="modal-footer">'+
//           '<button ng-click="close(result)" class="btn btn-primary" >Close</button>'+
//           '</div>';
//    //console.log($scope);
//   $scope.opts = {
//     backdrop: true,
//     keyboard: true,
//     backdropClick: true,
//     template:  t, // OR: templateUrl: 'path/to/view.html',
//     controller: 'TestDialogController'
//   };
// 
//   $scope.openDialog = function(e){
//   	e.preventDefault();
//   	console.log(e)
//   	var d = $dialog.dialog($scope.opts);
//     d.open().then(function(result){
//       if(result)
//       {
//         alert('dialog closed with result: ' + result);
//       }
//     });
//   };
// }
// 
// // the dialog is injected in the specified controller
// function TestDialogController($scope, dialog){
//   $scope.close = function(result){
//     dialog.close(result);
//   };
// }