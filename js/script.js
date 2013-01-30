
$(function() {
 	//setCookie('ZIP',"97217",90);
 	//setCookie('PLANCODE',"OR",90);
	
	// Instance the Data Model
	var demographicsDataModel = new Demographics();
	demographicsDataModel = setDataModelValues(demographicsDataModel);
	
	//Check Data Model Existence or Display Modal for info
	displayInitialModal(demographicsDataModel);
	
	// Event Binding Setup for Demographics Form, will call other functions
	attachDemographicsForm();
	
	// Event Binding Setup for External Site Links.
	attachExternalSite();
		
	console.log(demographicsDataModel);
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
* Event Bindings
*
***********************/

/***********
*	@name:			attachExternalSite()
*	@description:	Attach Modals to External site classed links and forms.
*
*	@param: 		N/A
*	@returns: 		N/A
***********/
function attachExternalSite(){
	var planCode = getCookie("PLANCODE");
	console.log(planCode)
	if(planCode == 'WA' || planCode == 'WARBS' || planCode == 'OR') {
		$('.external-site').click(function(e){
		
			// Always unbind the single modal effect on start.
			$('#confirmLeavingButton').unbind();
		
			// Get variables to test the condition of the form, One will be Undefined.
			var thisHref = $(this).get(0).href;
			var thisForm = $(this).attr('for');
		
			if ($(this).get(0).form != undefined){
				$('#confirmLeavingButton').click(function(){
					$('#'+thisForm).submit(); //submit();
				});
			}else if($(this).get(0).href != undefined){
				$('#confirmLeavingButton').click(function(){
					window.open(thisHref);
					$('#confirmLeaving').modal({
						show: false
					});
				});
			}else{
				return true;
			}
			$('#confirmLeaving').modal({
				show: true
			});
			return false;
		});
	}	
}

/***********
*	@name:			attachDemographicsForm()
*	@description:	Attach Events and Listeners for the Demographics Form
*
*	@param: 		N/A
*	@returns: 		N/A
***********/
function attachDemographicsForm(){
	$('#demographicSaveButton').click(function(){
		$('#getQuoteForm').submit();
	});
	
}

/***********************
*
* Content Initialization
*
***********************/

/***********
*	@name:			displayInitialModal()
*	@description:	Checks to see if the user has the correct data model contents and sets
*					Values based on that OR Displays a modal to collect the information
*
*	@param: 		N/A
*	@returns: 		N/A
***********/
function displayInitialModal(dataModel){
	var zipCodeValue = "No ZIP Code";
	if (dataModel.zip){
		zipCodeValue = dataModel.zip;
	}else{
		
		$('#demographicsModal .close').addClass('hide');
		$('#demographicCloseButton').addClass('hide');
		$('#demographicsModal').modal({
			keyboard: 	false,
			backdrop: 	'static',
			show:		true
		});
	}
	$("#showZipCode").html(zipCodeValue + ' (<a href="#demographicsModal" data-toggle="modal">Edit</a>)');
}

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






