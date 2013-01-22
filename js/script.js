// Our Javascript Calls

$(function() {
			
	$('a.modalLink').colorbox({href: function(){$(this).attr('href');}, title: function(){$(this).attr('title');}, width: '500px', height: '500px'}, function() {
		$.colorbox.resize();
		$('#demogCancel').click(function() { $.colorbox.close();});
	});
	var zipCode = ($.cookie("ZIPCODE"));
	if(zipCode == '' || zipCode == null || zipCode == 'null' || isUndefined(zipCode)) {
		$.colorbox({
			href:'modals/enh_demographics.jsp', 
			title: 'Demographics', 
			width: '500px', 
			height: '550px', 
			overlayClose: false,
			escKey: false,
			onComplete:function(){ 
				showForm('medicareBasic'); // select basic Medicare form
				$("#demographicButton").val('Continue');
				$("#cboxClose").hide();
				setFormValues(); // Populate form values (based on cookie data)
				submitAction(); // Set submit() action to the form on click
				setFormSubmitHandler('/medicare/index.jsp', false, 'medicareBasic');
				$("#spinner").ajaxElement(); // want to show the spinner when fetching the county list
				zipShowCountyList();
			}
		});
	}

	var leaveRegenceHTML = '<h2 style="color: #000; margin: 40px 30px;">You are about to leave the Regence Web site and enter another site that is NOT affiliated with or licensed by the Blue Cross Blue Shield Association.</h2><div style="position:absolute; left: 5%; bottom: 5%;"><a href="javascript:void(0)" id="leavingRetnBtn" class="button" style="border: 2px solid #71893f;background: #475c23; width: 100%;" title="Leave Regence"><span style="padding: 17px 12px;">Remain on Regence site</span></a></div><div style="position:absolute; right: 5%; bottom: 5%;"><a href="javascript:void(0)" id="leavingContBtn" class="button" style="border: 2px solid #71893f;background: #475c239; width: 100%;" title="Leave Regence"><span style="padding: 17px 12px;">Leave Regence</span></a></div>';

	var planCode = ($.cookie("PLANCODE"));
	$('input.external-site').click(function() {
		var thisForm = $(this).parent();
		if(planCode == 'WA' || planCode == 'WARBS' || planCode == 'OR') {
			$.colorbox({
				html: leaveRegenceHTML, 
				title: '', 
				width: '500px', 
				height: '300px', 
				onComplete:function(){
					$('#cboxTitle').hide();
					$('#leavingContBtn').click( function() {
						$.colorbox.close();
						thisForm.submit();
					});
					$('#leavingRetnBtn').click( function() {
						$.colorbox.close();
					});
				}
			});
			return false;
		} else {
			return true;
		}
	});
	$('a.external-site').click(function(e) {
		var thisLink = $(this).attr('href');
		if(planCode == 'WA' || planCode == 'WARBS' || planCode == 'OR') {
			$.colorbox({
				html: leaveRegenceHTML, 
				title: '', 
				width: '500px', 
				height: '300px', 
				onComplete:function(){
					$('#cboxTitle').hide();
					$('#leavingContBtn').click( function() {
						$.colorbox.close();
						window.open(thisLink);
					});
					$('#leavingRetnBtn').click( function() {
						$.colorbox.close();
					});
				}
			});
			return false;
		} else {
			return true;
		}
	});

	function isUndefined(x) {var u; return x === u;}

});
