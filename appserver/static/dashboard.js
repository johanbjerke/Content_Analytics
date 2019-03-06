console.log("I am loaded");
/**
	 * The below is a custom table renderer for the content table. It highlights colours inside the cells.
	 */
require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {
    var CustomIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            //return cell.field === 'Details' || cell.field === 'Description';
			return cell.field === 'Details';
        },
        render: function($td, cell) {
        	if (cell.field === 'Details') {
        		var details = cell.value;
        		var newYes = '<span class="green">Yes</span>'
				var newNo = '<span class="red">No</span>'
				var newZero = ' <span class="red">0</span>'
				var newText=""
				$.each( details, function( i, val ) {
					newText=val;
					newText = newText.replace(RegExp("Yes", "gi"), newYes);
					newText = newText.replace(RegExp("No", "gi"), newNo);
					newText = newText.replace(RegExp(" 0", "gi"), newZero);
					details[i]=newText+'<br />';

				});

				//cell.value=details;
				$td.html(details);
			} else if (cell.field === 'Description') {
        		/*
        		//This part it WIP
        		var value = cell.value;
        		var searchfilter = $("input[type='text']").val()
        		console.log(searchfilter)
				newText = value.replace(RegExp(searchfilter, "gi"), '<span class="red">'+searchfilter+'</span>');
        		$td.html(newText);
				console.log(newText)
				*/
			}
        }
    });
    mvc.Components.get('content_table').getVisualization(function(tableView){
        // Register custom cell renderer, the table will re-render automatically
        tableView.addCellRenderer(new CustomIconRenderer());
    });
});

/**
	 * The below defines tooltips.
	 */
require(["jquery",
        "splunkjs/ready!",
        "bootstrap.popover",
        "bootstrap.tooltip"
    ],
    function(
        $, Ready) {
		$("label:contains('Split by')").prop('title', 'This option selects which field to split the X-axis by.');
		$("label:contains('Phase')").prop('title', '<p>Current: Content is installed, the data is in Splunk and it is enabled.</p><p>Phase 1: Content is installed, the data is in Splunk and but it is disabled.</p><p>Phase 2: Content is installed, the data is not in Splunk and it is disabled.</p><p>Selected Sourcetypes: This highlight where the selected sourcetypes would map to what is on the X-axis. .</p>');
		$("label:contains('Sourcetype origin')").prop('title', '<p>Installed Sourcetypes: The chart is filtered to Sourcetypes that are currently installed.</p><p>All Sourcetypes: The chart is filtered to sourcetypes that are either installed or are referred to in the content search string.</p><p>Sample Sourcetypes: The chart is filtered to sourcetypes that are provided with the app. This list represents a large proportion of the sourcetypes available on Splunkbase. This setting will allow you to run analytics without having any Add-ons or data in Splunk.</p>');
		$("label:contains('Sourcetype selection')").prop('title', 'Select which Sourcetypes to highlighted in the "Selected" field');
		$("label:contains('Data')").prop('title', 'Filters the list to show if we have data for the content.');
		$("label:contains('Enabled')").prop('title', 'Filters the list to show if we have enabled the content.');
		$("label:contains('Datamodel')").prop('title', 'Filters the list to show only the selected Datamodel.');
		$("label:contains('Use Case')").prop('title', 'Filters the list to show only the selected Use Cases. The Use Cases are high level categories that are useful to gauge the level of maturity for the content.');
        $("label:contains('Sourcetype filter')").prop('title', 'Filters to show only content that is mapped to the selected Sourcetypes.');
		$("label:contains('Add-On')").prop('title', 'Filters the list to show only content that is mapped to the selected Add-On.');
        $("label:contains('Sourcetype and Add-On')").prop('title', 'Toggle to show the list of Sourcetypes and Add-Ons associated with the content.');
		$("label:contains('Search Query')").prop('title', 'Toggle to show the actual SPL search for the content.');
		$("label:contains('Search Filter')").prop('title', 'The filter does a case insensitive text match. There are implied wildcards before and after the input string. You can also specify underscore ( _ ) characters for a single character match.');
		$("label:contains('MITRE Tactic')").prop('title', 'MITRE Tactics represent the "why" of an ATT&CK technique. It is the adversary’s tactical objective: the reason for performing an action. See the MITRE reference link at the top of the page for more details.');
		$("label:contains('MITRE Technique')").prop('title', 'MITRE Techniques represents “how” an adversary achieves a tactical objective by performing an action. See the MITRE reference link at the top of the page for more details.');
        $("label:contains('Kill Chain Phase')").prop('title', 'Each step in the Cyber Kill Chain defines the steps used by cyber attackers.  The theory is that by understanding each of these stages, defenders can better identify and stop attacks at each of the stages. See the Cyber Kill Chain reference link at the top of the page for more details.');
		$("label:contains('NIST')").prop('title', 'The NIST Cybersecurity Framework presents a listing of Functions, Categories, Subcategories and Informative References (standards, guidelines, and practices) that describe specific cybersecurity activities. The mapping in this app represents the Function and Category elements of the framework. See the NIST Cybersecurity Framework reference link at the top of the page for more details.');
		$("label:contains('CIS')").prop('title', 'The CIS Controls are a prioritized set of controls and actions to defend against pervasive cyber threats. See the CIS Controls reference link at the top of the page for more details.');
		$("label[title]").tooltip({ html: 'true' })
    })
require(['jquery','underscore','splunkjs/mvc', 'bootstrap.tab', 'splunkjs/mvc/simplexml/ready!'],
		function($, _, mvc){

	/**
	 * The below defines the tab handling logic.
	 */

	// The normal, auto-magical Bootstrap tab processing doesn't work for us since it requires a particular
	// layout of HTML that we cannot use without converting the view entirely to simpleXML. So, we are
	// going to handle it ourselves.
	var hideTabTargets = function(){

		var tabs = $('a[data-elements]');

		// Go through each toggle tab
		for(var c = 0; c < tabs.length; c++){

			// Hide the targets associated with the tab
			var targets = $(tabs[c]).data("elements").split(",");

			for(var d = 0; d < targets.length; d++){
				$('#' + targets[d], this.$el).hide();
			}
		}
	};

	var selectTab = function (e) {

		// Stop if the tabs have no elements
		if( $(e.target).data("elements") === undefined ){
			console.warn("Yikes, the clicked tab has no elements to hide!");
			return;
		}

		// Get the IDs that we should enable for this tab
		var toToggle = $(e.target).data("elements").split(",");

		// Hide the tab content by default
		hideTabTargets();

		// Now show this tabs toggle elements
		for(var c = 0; c < toToggle.length; c++){
			$('#' + toToggle[c], this.$el).show();
		}

	};

	// Wire up the function to show the appropriate tab
	$('a[data-toggle="tab"]').on('shown', selectTab);

	// Show the first tab
	$('.toggle-tab').first().trigger('shown');

	// Make the tabs into tabs
    $('#tabs', this.$el).tab();
    $('#tabs_content_table', this.$el).tab();

    /**
     * The code below handles the tokens that trigger when searches are kicked off for a tab.
     */

    // Get the tab token for a given tab name
    var getTabTokenForTabName = function(tab_name){
    	return tab_name; //"tab_" +
    }

    // Get all of the possible tab control tokens
    var getTabTokens = function(){
    	var tabTokens = [];

    	var tabLinks = $('#tabs > li > a');

    	for(var c = 0; c < tabLinks.length; c++){
    		tabTokens.push( getTabTokenForTabName( $(tabLinks[c]).data('token') ) );
    	}

    	return tabTokens;
    }

    // Clear all but the active tab control tokens
    var clearTabControlTokens = function(){
    	console.info("Clearing tab control tokens");

    	var tabTokens = getTabTokens();
    	var activeTabToken = getActiveTabToken();
    	var tokens = mvc.Components.getInstance("submitted");

    	// Clear the tokens for all tabs except for the active one
    	for(var c = 0; c < tabTokens.length; c++){

    		if( activeTabToken !== tabTokens[c] ){
    			tokens.set(tabTokens[c], undefined);
    		}
    	}
    }

    // Get the tab control token for the active tab
    var getActiveTabToken = function(){
    	return $('#tabs > li.active > a').data('token');
    }

    // Set the token for the active tab
    var setActiveTabToken = function(){
    	var activeTabToken = getActiveTabToken();

    	var tokens = mvc.Components.getInstance("submitted");

    	tokens.set(activeTabToken, '');
    }

    var setTokenForTab = function(e){

		// Get the token for the tab
    	var tabToken = getTabTokenForTabName($(e.target).data('token'));

		// Set the token
		var tokens = mvc.Components.getInstance("submitted");
		tokens.set(tabToken, '');

		console.info("Set the token for the active tab (" + tabToken + ")");
    }

    $('a[data-toggle="tab"]').on('shown', setTokenForTab);

    // Wire up the tab control tokenization
    var submit = mvc.Components.get("submit");

    submit.on("submit", function() {
    	clearTabControlTokens();
    });

    // Set the token for the selected tab
    setActiveTabToken();

});






