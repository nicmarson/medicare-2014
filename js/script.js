/***********************
*
* Medicare 2013 JS
* Author	Tara Grieb and Unnamed Uncountable Legacy Coders
* Thought	There are no temporary fixes, just permanent patches. ಠ_ಠ
*
*	@TODO	Come up with a better Debug method 
*
***********************/

$(function() {	
	// Set the jumpMenu event, this is awful.
	$('#jumpMenu').change(function(){
		jumpMenu($(this).val());
	});
	
	// Instance the Data Models
	var demographicsDataModel 	= new Demographics();
	var cookieMapDataModel 		= new CookieMap();
	
 	demographicsDataModel = setDataModel(demographicsDataModel, {
 		'map'		: cookieMapDataModel,
 		'cookie'	: true
 	});
	
	// Show or Hide Content based on Datamodel
	setProductToggle(demographicsDataModel);
	
	// Event Binding Setup for Demographics Form, will call other functions
	attachDemographicsForm(demographicsDataModel);
	
	//Check Data Model Existence or Display Modal for info
	displayInitialModal(demographicsDataModel);
	
	// Event Binding Setup for External Site Links.
	attachExternalSite();
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
	this.exp				= false;
	this.keepMe				= false; 
	this.alreadyMedicare	= false;
	this.coverage			= false; // Coverage year
	this.planValue			= false; // State identification
	this.county				= false; // County name
	this.serviceArea		= false; // Default will use planValue, otherwise will overwrite planValue
	this.zip				= false; // Zip code
	this.age				= false; // Age
	this.gender				= false; // Gender
	this.plancode			= false; // Asuris or non-asuris 
	this.state				= false; // state identifier
	this.offerMedAdvantage	= false;
	this.offerMedigap		= false;
	
	demographicsDataStorage = $('<div>',{'id': 'demographicsDataStorage'}).appendTo('body').data(this);
	return;
}

/***********
*	@name:			CookieMap()
*	@description:	Map cookies to Demographics data model
*
*	@param: 		N/A
*	@returns: 		true;
***********/
function CookieMap(){
	this.PLANCODE	= 'planValue';
	this.ZIP		= 'zip';
	this.ZIPCODE	= 'zip';
	this.age0		= 'age';
	this.gender0	= 'gender';
	return;
}

/***********
*	@name:			setDataModel()
*	@description:	Set Data Model Values from Cookies if the cookies Exist.
*
*	@param: 		(string) 		dataModel 	Data Model to Build Into
*
*	@returns: 		(string|false)	Requested Cookie Value
*
*	@TODO:			Can this be used as a prototype method of the datamodel object, allowing datamodels to be generated on the
*					Fly as part of a core model set? Must research this, use case extreme, build prototyped modelset.
***********/
function setDataModel(dataModel, options){
	
	var values	= typeof(options.values) 	!= 'undefined'	? options.values 	: false;
	var map		= typeof(options.map) 		!= 'undefined'	? options.map 		: false;
	var cookie	= typeof(options.cookie) 	!= 'undefined'	? options.cookie 	: false;
	
	newDataModel = new Object;
	
	// Evaluate existing Data Model and Get new values and put them in "newDataModel" to replace old.
	$.each(dataModel, function(dataModelKey, dataModelValue){
		if (values){
			if (typeof(values[dataModelKey]) != 'undefined')
			{
				newDataModel[dataModelKey] = values[dataModelKey];
			}else{
				newDataModel[dataModelKey] = false;
			}
		}
		
		if (cookie){
			newDataModel[dataModelKey] = getCookie(dataModelKey);
			if (map){
				$.each(map, function(mapKey, mapValue){
					if (mapValue == dataModelKey && getCookie(mapKey)){
						newDataModel[dataModelKey] = getCookie(mapKey);
					}
				});
			}
		}
	});
	return newDataModel;
}

/***********
*	@name:			setCookies()
*	@description:	Multiple Cookies at one time
*
*	@param: 		(string) 		keyValuePairs 	Key Values to make cookies.
*	@param: 		(object) 		options 		Object Containing Optional Params (Not Used)
*
*	@returns: 		(string|false)	
*
*	@TODO			Might be value in rolling this in as a polymorphic function of the basic set cookie. 
***********/
function setCookies(keyValuePairs, options){
	
	$.each(keyValuePairs, function(key, value){
		setCookie(key,value,90);
	});
	
	return;
}

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
	//console.log(planCode)
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
*	@description:	Attach Events and Listeners for the Demographics Form. Contains Legacy functionality
*
*	@param: 		N/A
*	@returns: 		N/A
*
*	@TODO			Remove and refactor legacy stuff as time allows. Hook up Validate Error Shhhtuffff.
***********/
function attachDemographicsForm(dataModel){
	// On Visible Focus on the first. ??? Needs Testing
	$('#zipCode:visible').focus();
	
	// A number of things change if there is already data, lets only do what NEEDS to be done.
	if (dataModel.zip){
		// Set inputs with existing values if set int the data model.
		setFormValues(dataModel);
		handleZip(dataModel.zip);
	}else{
		// If there is no zip in the datamodel lets hide the counties dropdown till it is used.
		$('#countyDropdown').hide();
	}
	
	// On key up we check to make sure if the value is correct 
	$("#zipCode").on('blur keyup click change',function () {
		var value = $(this).val();
		
		if (value.length == 5)
		{
			if ($(this).data( 'last' ) != value)
			{
				$(this).data( 'last', value );
				handleZip(value);
			}
		}
	});
	
	$('#demographicSaveButton').click(function(){
		//setFormSubmitHandler('/medicare/index.jsp', 'false', 'medicareBasic');
		setFormSubmitHandler('#', dataModel);
	});
	
	/***********
	*	@name:			handleZip()
	*	@description:	Internal Function get data from the zip
	*
	*	@param: 		(string)	zipcode The basic zipcode value, 5 numbers long. 
	*	@returns: 		N/A
	*
	*	@TODO			Get it DONE No more "Temporary Fixes" There is no such thing.
	***********/
	function handleZip(zipcode) {
		
		// 	Annoying little Debug thing because using Teamsite would drive me crazy, 
		//	pull before production.....Tara I am looking at you.
		if (document.domain == 'localsandbox.com')
		{
			var planCodeURL = 'plancode.html';
			//var planCodeURL = '/planCodeService.do';
		}else{
			var planCodeURL = '/planCodeService.do';
		}

		// Get the plan value from planCodeService.do
		// Returns xml w/ plancode & area
		// DOES TOO MUCH!
		var planCodeAjax = $.ajax({
			type: "GET",
			url: planCodeURL,
			data: "zip=" + zipcode,
			dataType: 'xml'});
		planCodeAjax.fail(function(){
			validatePlanValue("", "SYSTEM_ERROR");
		});
		planCodeAjax.done(function(data){
			//console.log(data);
			$(data).find("plancode").each(function(){
				var planValue 	= $(this).find('value').text();
				var area    	= $(this).find('area').text();
				var errorValue  = $(this).find('error').text();
				//var age     	= $("#age").val();
				
				// Asotin county medicare products are provided by ID and not ASURIS 
				if ( zipcode == "99401" || zipcode == "99402" || zipcode == "99403" ) {
					planValue = 'WARBS';
					area = 'id';
				}

				validatePlanValue(planValue, errorValue);
				if ( formValidated == false) {
				  return false;
				}

				// Set state value
				if (area == 'clark_co'){
				  $("#state").val('WA');
				} else {
				  $("#state").val(planValue);
				}

				// hide the county selection
				if (planValue != 'ASURIS' && planValue != 'ERROR'){
					var counties = [];
					// Clark County returns OR although we want the county list from WARBS
					if (area == 'clark_co'){
						planValue = 'WARBS'; 
					} 
					counties = getCountyList(planValue);
					var send_data = { 'collection':counties };
					createCountyList(send_data);
					
					// Only display the dropdown if there is data, duh.
					$('#countyDropdown').show();
					$("#planvalue").val(planValue); // Set planValue
				}
			});
		});
	}
	
	/***********
	*	@name:			getCountyList()
	*	@description:	Ajax Call to Evaluate County List XML
	*
	*	@param: 		(string)	state State Code for XML
	*	@returns: 		(array)		countyList Array of counties
	*
	*	@TODO			Really why is this separate
	***********/
	function getCountyList(state) {
	  var countyList = new Object;
	  $.ajax({
		type: 'GET',
		dataType: 'xml',
		url: '/xml/USStateList.xml',
		data: state,
		async: false,
		success: function (xmlDoc) {
		  $(xmlDoc).find('*[planServiceID*='+state+']').each(function () {
			$(this).find("county").each(function(send_data){
			  var send_medigap = $(this).attr('medigap');
			  var send_medAdvantage = $(this).attr('medAdvantage');
			  var this_name = $(this).text();
			  var serviceArea = $(this).attr('serviceArea');
			  data = {name:this_name,serviceArea:serviceArea,medigap:send_medigap,medAdvantage:send_medAdvantage};
			  countyList.push(data);
			});
		  });
		}
	  });
	  //if (debug){log('DEBUG: getCountyList is returning '+countyList)};
  
	  return countyList; // returns array of county names
	}
	
	/***********
	*	@name:			createCountyList()
	*	@description:	Create drop down list for countie
	*
	*	@param: 		(string)	data State Code for XML
	*	@returns: 		N/A
	*
	*	@TODO			Really why is this separate
	***********/
	function createCountyList(data) {
	  $('#counties').html(''); // clear
	  var countyList = ''; //Using a string since it's much faster to collect all the values and append them once
	  countyList = '<option class="textbox" title="" value="">Please Select...</option>';
	//console.log("The data is: "+data['collection']);
	  $.each(data['collection'], function (i) {
	//console.log("The list is: "+countyList);
		var option_name = data['collection'][i]['name'];
		var medigap = data['collection'][i]['medigap'];
		var medadvantage = data['collection'][i]['medAdvantage'];
		var serviceArea = data['collection'][i]['serviceArea'];
		var options = '{"medigap":"'+medigap+'","medAdvantage":"'+medadvantage+'","serviceArea":"'+serviceArea+'"}';
		countyList += "<option title='"+options+"' value='"+option_name+"'>"+option_name+"</option>";
	  });
	  $('#counties').html(countyList);
	  if (typeof data['selected'] === 'string'){
		$("#counties").val(data['selected']);
	  }
	  setCountyOptionsToValues();
	}

	// Set the values to each option in the county list
	function setCountyOptionsToValues() {
	  var county_value = $("#counties").val();
	  var options = "";
	  if($("#counties option:selected").attr('title').length) {
		options = $("#counties option:selected").attr('title');
	  } else {
		options = '{"medigap":"true","medAdvantage":"true","serviceArea":"default"}';
	  }
	/*
	  //eval("(" + options + ")");
	*/

	  var obj  = (typeof options == "string") ? $.parseJSON(options) : options;
	  var offer_medigap = obj['medigap'];
	  var offer_medadvantage = obj['medAdvantage'];
	  var serviceArea = obj['serviceArea'];
	  $("#serviceArea").val(serviceArea);
	  $("#offerMedigap").val(offer_medigap);
	  $("#offerMedAdvantage").val(offer_medadvantage);
	}
	
	/***********
	*	@name:			getCountyList()
	*	@description:	Ajax Call to Evaluate County List XML
	*
	*	@param: 		(string)	action WOT?
	*	@returns: 		(array)		countyList Array of counties
	*
	*	@TODO			Really why is this separate
	***********/
	// Submit Handler for the form
	//var formValidated;
	function setFormSubmitHandler(action, dataModel) {
	
		var coverageYear	= $("input[name='coverage']:checked").val();
		var countyValue		= $("#counties").val();
		var serviceArea		= $("#serviceArea").val();
		var coverageLoc		= $("input[name='coverage']:checked").val();
		var age				= $("#age").val();

		// direct page
		partDonly(action); // This will redirect users to another page if only part D is offered for their region

		if (serviceArea != 'default'){
			$('#planValue').val(serviceArea);
		}
		var url = "/medicare/"+coverageLoc+"?"+$("#getQuoteForm").serialize();
		
		var paramObj = new Object;
		$.each($('#getQuoteForm').serializeArray(), function(_, kv) {
		  if (paramObj.hasOwnProperty(kv.name)) {
			paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
			paramObj[kv.name].push(kv.value);
		  }
		  else {
			paramObj[kv.name] = kv.value;
		  }
		});
		
		setCookieString(paramObj, dataModel);
		window.location = url;
	}
// 	  });
// 	}
	
	// Part D only redirect ?? ARG
	function partDonly(action) {
	  var c = eval('(' + getCookie("demographics") + ')');
	  var medigap = c['offerMedigap'];
	  var medadvantage = c['offerMedAdvantage'];
	  if ( medigap == 'false' && medadvantage == 'false'){
		//if(debug){alert("partD only offered");}
		if (action == '/medicare/shop.jsp' ){
		  action = '/medicare/part-d/index.jsp'; // we'll skip the shop page since only part D is offered in this region
		  //if(debug){alert("action being set to "+action);}
		}
		var url = action+"?"+$("#getQuoteForm").serialize();
		//if(debug){alert("full url being set to "+url);}
		formValidated = false;
		window.location = url;
	  }
	}
	
	/***********
	*	@name:			setCookieString()
	*	@description:	Ajax Call to Evaluate County List XML
	*
	*	@param: 		(object)	formData form submitted data array serialized
	*	@returns: 		(object)	dataModel dataModel
	*
	*	@TODO			Really why is this separate
	***********/
	function setCookieString(formData, dataModel) {	
		// map data from form to progressive dataModel
		dataModel.coverage				= formData.coverage;		// Coverage year
		dataModel.planValue				= formData.planvalue;		// State identification
		dataModel.county				= formData.counties;		// County name
		dataModel.serviceArea			= formData.serviceArea;		// Default will use planValue, otherwise will overwrite planValue
		dataModel.zip					= formData.zipCode;			// Zip code
		dataModel.age					= formData.a0; 				// Age (id=age name=a0) WHY GOD WHY?
		dataModel.gender				= formData.g0;				// (id=gender name=g0) WHY GOD WHY? Also No way to set this Why do we have it.
		dataModel.plancode				= formData.plancode;		// Wait!? Is this Plan Value? Why are these used interchangeably.
		dataModel.state					= formData.state;			// state identifier -- Or you know, State, since a name IS an identifier.
		dataModel.offerMedAdvantage		= formData.offerMedAdvantage;
		dataModel.offerMedigap			= formData.offerMedigap;
		
		// Remember user sets the expiration days of cookie (THIS SHOULD NOT MAKE DOM CALLS)
		if ( $("input[name=keepMe]").is(':checked') ) {
		dataModel.exp 		= 90; // Remember user
		dataModel.keepMe	= 'on'; 
		$("input[name=keepMe]").val('on');
		} else {
		dataModel.exp 		= 0; // Do not remember user
		dataModel.keepMe	= 'off'; 
		}

		// set value to already Medicare field
		if ( $("input[name=onMedicare]").is(':checked') ) {
		$("input[name=onMedicare]").val('on');
		dataModel.alreadyMedicare	= 'on';
		} else {
		dataModel.alreadyMedicare	= 'off';
		}
		
		
		
		var cookieString = "{'zip':'" + dataModel.zip + "','age':'" + dataModel.age + "', 'state':'" + dataModel.state + "', 'county':'" + dataModel.county + "', 'serviceArea':'" + dataModel.serviceArea + "', 'gender':'" + dataModel.gender + "', 'offerMedAdvantage':'" + dataModel.offerMedAdvantage + "', 'offerMedigap':'" + dataModel.offerMedigap + "', 'coverage':'" + dataModel.coverage + "', 'onMedicare':'" + dataModel.alreadyMedicare + "', 'plancode':'" + dataModel.plancode + "', 'rememberMe':'" + dataModel.keepMe + "'}";

  
  
		// Demographics cookie
		setCookie("demographics", ( cookieString ), dataModel.exp );

		// Plancode coookie 
		setCookie("PLANCODE", ( dataModel.planValue ), dataModel.exp );

		// SALO: the medigap pages are still using these cookies, annoying... 
		// need to set them here to navigate from medAdvantage to medigap

		setCookie('age0', ( dataModel.age ), 0);
		setCookie('ZIP', ( dataModel.zip ), 0);
		setCookie('ZIPCODE', ( dataModel.zip ), 0);
		setCookie('gender0', ( dataModel.gender ), 0);
		$('#demographicsDataStorage').data(dataModel);
	}
	
	// Show the main spinner for submitting form
	function showSpinner() {
	  $("#getQuoteForm").attr('style','visibility:hidden').before('<div class="spinner" style=""><h2>Loading...</h2></div>');
	  $("#cboxTitle").attr('style','visibility:hidden');
	}
	
	/***********
	*	@name:			setFormValues()
	*	@description:	Set Demographics Form Data
	*
	*	@param: 		(object) 		dataModel Data Model for Value checking
	*	@returns: 		N/A
	*
	*	@TODO:			Refactor and make run on Data Model. Reduce Minification and reduce ID calls. Make more open and abstract.
	*
	***********/
	function setFormValues(dataModel) {
	  if( getCookie("demographics") ) {
		var c = eval('(' + getCookie("demographics") + ')');
		var gender = c['gender']; 
		var coverage = c['coverage'];
		var county = c['county'];
		var serviceArea = c['serviceArea'];
		$("#gender option[value='"+gender+"']").attr('selected', 'selected'); // Set the gender
		$("#zipCode").val(c['zip']); // Set the zip
		$("#age").val(c['age']); // Set the age
		$("#serviceArea").val(c['serviceArea']); // Set the serviceArea
		$("#offerMedigap").val(c['offerMedigap']); // Offer Medigap
		$("#offerMedAdvantage").val(c['offerMedAdvantage']); // Offer MedAdvantage
		if (c['onMedicare'] == "on"){$("#alreadyMedicare").attr('checked', true);} // Set alreadyMedicare
		if (c['rememberMe'] == "on"){ $("#rememberMe").attr('checked', true); } // Set remember me
		$("#coverage"+coverage).attr('checked', 'checked'); // Set coverage selected


		// Create the list of Counties
		var countyList = [];
		var state = c['state'];

	   //  if(debug){
	//       alert('state is returning: '+state);
	//     }
		if (typeof(state) == "undefined" || state == '') {
		  state=pCode;
		}
		if (typeof(state) == "undefined" || state == '') {
		  state=pCode;
		}
		countyList = getCountyList(state);
	
		var send_data = { 'collection':countyList,'selected':county };
		createCountyList(send_data);
	
	  } else if ( getCookie("ZIP") ) {
		var zip = getCookie("ZIP");
		$("#zipCode").val(zip); // Set the zip
	  } else { 
		// do nothing 
	  }
  
	  // Java reads the plancode cookie seperate (in this case plancode = planvalue)
	  if ( getCookie("PLANCODE")){
		var planValue = getCookie("PLANCODE");
		$("#planvalue").val(planValue); // Set the planValue
	  }
  
	  // TODO: need a better solution here so the value of 0 doesn't show up in the age field
	  // Need to set default value so java doesn't blow up
	  if ( $("#age").attr('type') == 'hidden' ) { $("#age").val('0'); }
	}

	/***********
	*	@name:			validatePlanValue()
	*	@description:	Validate Plan Data? WHY?
	*
	*	@param: 		(string) 		planValue Plan Value is the Brand Info/Region
	*	@param: 		(string) 		errorValue Error Returned by something or other.
	*	@returns: 		N/A
	*
	*	@TODO:			Refactor and make run on Data Model. Reduce Minification and reduce ID calls. Abstract and Roll into approp
	*
	***********/
	// Validation for the Plan Value 
	// checks if ERROR, [empty], or ASURIS is being returned from planCodeService.do
	function validatePlanValue(planValue, errorValue) {
	  // validation rules
	  var eMessage;
	  if (errorValue == "POORLY_FORMATTED_ZIP") {
		displayError("Please enter a 5 digit zip code.", ".formErrorsDemo");
		formValidated = false;
	  }
	  else if (errorValue == "OUT_OF_AREA_ERROR" || errorValue == "WRONG_BRAND" || planValue == 'ASURIS' || planValue == 'AS') {
		displayError("We do not offer Medicare coverage options to residents of the zip code you entered. You can find a Blue Cross and Blue Shield company near you at <a href='http://www.bcbs.com' target='_blank'>www.bcbs.com</a>", ".formErrorsDemo"); //BCBSA cannot reference affiliatesfs
		formValidated = false;
	  }
	  else if ( errorValue == "SYSTEM_ERROR" || planValue == 'ERROR' || planValue == '' ) {
		eMessage = "We're sorry, but there was a problem finding Medicare plans for you.  For information about our Medicare  plans, please contact us at 1-800-541-8981, (or TTY 711),  between 8 a.m. and 8 p.m. Monday through Friday.  Between October 15 through February 14 our telephone hours are 8 a.m. to 8 p.m., seven days a week.  Customer Service also has free language interpreter services available for non-English speakers.";
		displayError(eMessage, ".formErrorsDemo");
		formValidated = false;
	  } else {
		removeErrors();
		formValidated = true;
	  }
	}

	/***********
	*	@name:			removeErrors()
	*	@description:	Remove Errors from Demographics Form.
	*
	*	@param: 		(string) 		planValue Plan Value is the Brand Info/Region
	*	@param: 		(string) 		errorValue Error Returned by something or other.
	*	@returns: 		N/A
	*
	*	@TODO:			Refactor and make run on Data Model. Reduce Minification and reduce ID calls. Abstract and Roll into approp
	*
	***********/
	function removeErrors() {
	  $(".formErrorsDemo").hide();
	}

	/***********
	*	@name:			displayError()
	*	@description:	Display Errors from Demographics Form.
	*
	*	@param: 		(string) 		message Error Message
	*	@param: 		(string) 		location Location, Really? The location is not even used very much. Shouldn't all elements be consistant?
	*	@returns: 		N/A
	*
	*	@TODO:			Refactor and make run on Data Model. Reduce Minification and reduce ID calls. Abstract and Roll into approp
	*
	***********/
	// Show error message
	function displayError(message, location) {
	  // Remove any previous errors
	  //$('.spinner').remove();
	  $("#cboxTitle").attr('style','visibility:display');
	  $('#getQuoteForm').find('.highlightError').each(function () {
		$(this).removeClass('highlightError');
	  });
	  $(location)
		.show()
		.html( '<p class="errortext">'+message+'</p>' ).fadeIn();
	  $("#getQuoteForm").removeAttr('style');
	  //$.colorbox.resize();
	  $('#countyDropdown').hide();
	}

	// Show the main spinner for submitting form
	function showSpinner() {
	  $("#getQuoteForm").attr('style','visibility:hidden').before('<div class="spinner" style=""><h2>Loading...</h2></div>');
	  $("#cboxTitle").attr('style','visibility:hidden');
	}
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
		$('#zipCode').val('');
		$('#demographicsModalLabel').text('Demographics')
		$('#demographicsModal .close').addClass('hide');
		$('#demographicCloseButton').addClass('hide');
		$('#demographicSaveButton').text('Continue');
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
		var cookies = []
		for (i=0;i<ARRcookies.length;i++)
		{
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			cookies[x] = unescape(y);

		}
		return cookies
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
function setCookie(name,value,days) {
	//console.log(name + ', ' + value + ', ' + days);
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
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
	//console.log(document.cookie);
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

/************************************************************************
*	Hash Setter
*	@author 	Tra Grieb
*	@version 	2013 Refactor
*	@date		
* 
*	@param: params (params Object)
* 		Properties:
*			@param: filters (Associative Array)
*
*	@description: This function drives all of the hash controls for the site.
*
************************************************************************/

function hashSetter(params){
	// PARSE PARAMETERS
	// Use filters for dynamic values.
	var filters	= typeof(params.filters) 	== 'object'	? params.filters 	: params;	//can pass the filters object as params or a property thereof
	parsedObject = $.extend(hashGetter(), filters);

	// Build Hash.
	var urlHash = '';
	$.each(parsedObject, function loopParams(k,v){
		if (v != ''){
			urlHash += '/' + k + '=' + v;
		}		
	});
	document.location.hash = urlHash;
}

/***********************
*
* Legacy
*
***********************/

/***********
*	@name:			setProductToggle()
*	@description:	Check to see if medigap and/or medadvantage is not offered in the selected county
*
*	@param: 		(object) 		dataModel Data Model for Value checking
*	@returns: 		N/A
*
*	@TODO:			Refactor and make run on Data Model. Reduce Minification and reduce ID calls.
***********/
function setProductToggle(dataModel) {
  if (getCookie("demographics") ) {
    var c = eval('(' + getCookie("demographics") + ')');
    var medigap = c['offerMedigap'];
    var medadvantage = c['offerMedAdvantage'];
    //if (debug){log('medigap is set to ' + medigap);}
    //if (debug){log('medadvantage is set to ' + medadvantage);}
    
    // css for these are set by default to display:none;
    if (medigap == 'false' && medadvantage == 'false'){
      $("#menu2").removeClass('active');
      $("#menu2 a").attr("href", "/medicare/part-d/index.jsp").html("Shop <span>Compare Part-D plans</span>");
    }
    
    if (medigap == 'true'){
      $("#MedigapWrapper").show();
      $("#navMedigap").show();
    } else {
      $("#MedigapWrapper").removeClass('product');
      $("#navMedigap").removeClass('navproduct');
    }
    
    if (medadvantage == 'true'){
      $("#medAdvantageWrapper").show();
      $("#navMedAdvantage").show();
      $(".medAdvantageLink").show();
      $('#medicareplans .plansbox').addClass('sunit4').removeClass('sunit6');
    } else {
      $("#medAdvantageWrapper").removeClass('product');
      $("#navMedAdvantage").removeClass('navproduct');
      $('#medAdvantageWrapper').hide();
      $('.medAdvantageLink').hide();
      $('#medicareplans .plansbox').removeClass('sunit4').addClass('sunit6');
    }
    var t = $(".navproduct").length;
    if (t == '3'){
      $("#partDWrapper").show();
    } else if (t == '2'){
      $(".product").css('width', '400px');
      $(".navproduct").css('width', '427px');
      $(".product:last").css('border-right', 'none');
      $(".navproduct:last").css('border-right', 'none');
      $("#partDWrapper").show();
    } else if (t == '1'){
      $(".product").css('width', '800px');
      $(".navproduct").css('width', '800px');
      $(".product:last").css('border-right', 'none');
      $(".navproduct:last").css('border-right', 'none');
      $("#partDWrapperSingle").show();
      $("#partDWrapper").hide();
    } else {
      $("#partDWrapper").show();
    }
    
  }
}

/***********
*	@name:			checkAvail()
*	@description:	Check if MedAdvantage and/or Medigap is offered, remove tabs if needed
*
*	@param: 		(object) 		dataModel Data Model for Value checking
*	@returns: 		N/A
*
*	@TODO:			Refactor and make run on Data Model. Reduce Minification and reduce ID calls. THis seems to duplicate functionality of existing
*
***********/
// Check if MedAdvantage and/or Medigap is offered, remove tabs if needed
function checkAvail(dataModel) {
  if (getCookie("demographics") ) {
    var c = eval('(' + getCookie("demographics") + ')');
    var medigap = c['offerMedigap'];
    var medadvantage = c['offerMedAdvantage'];
    // Members Page
    $(".checkAvail").each(function () {
      if (medigap == 'false'){
        $("#tab4").remove();
        $("#medigap").remove();
      }
      if (medadvantage == 'false'){
        $("#tab1").remove();
        $("#medAdv").remove();
        $("#tab2").remove();
        $("#medAdvRx").remove();
        $("#tab3").addClass('first');
      } 
    });
    // Forms Page
    $(".checkAvailForms").each(function () {
      if (medigap == 'false'){
        $("#tab4").remove();
        $("#medigap").remove();
      } 
      if (medadvantage == 'false'){
        $("#tab2").remove();
        $("#medAdvantage").remove();
      }
    });
    
  }
}

/***********
*	@name:			jumpMenu()
*	@description:	Silly little Menu. Seriously, this is very 1996
*
*	@param: 		(string) 		message Error Message
*	@param: 		(string) 		location Location, Really? The location is not even used very much. Shouldn't all elements be consistant?
*	@returns: 		N/A
*
*	@TODO:			Change this whole thing, really honestly. IT WAS A MACROMEDIA JAVASCRIPT. ::HEADDESK::
*
***********/
function jumpMenu(location){
  window.location = location;
}
