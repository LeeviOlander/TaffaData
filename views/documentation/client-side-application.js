var converter = new showdown.Converter();

var titleCardId = 'title';
var specificationsCardId = 'specifications';
var structureCardId = 'structure';
var implementationCardId = 'implementation';

var layout =
`
    <div class="row">
        <div class="col-12" id="${titleCardId}">
        </div>
        <div class="col-12" id="${specificationsCardId}">
        </div>
        <div class="col-12" id="${structureCardId}">
        </div>
        <div class="col-12" id="${implementationCardId}">
        </div>
    </div>
`;

var specificationsCardMarkdownContent =
`	
1. **Ease of Accessibility**

	The client side application should be runnable from both the web and from local files without any installations nor
	configurations. In other words, a monkey should be able to start the application successfully. This means that XMLHttpRequests 
	can not be relied on and should not be used. An XMLHttpRequest causes CORS errors when ran from a local file at least 
	on Chromium based browsers. The problem could be circumvented by launching Chrome with some command line flags, but in that
	case the application would be too difficult to execute. This is why the data has to be encoded in the special JSED format. As such
    custom JavaScript and CSS should not be minified.

	<br>

1. **Self Contained**

	The client side application should be fully self contained. A content delivery network can not be used, since otherwise 
	the application will not work in an offline environment.

	<br>

1. **No Non-Native Programming Languages**

	If a browser can not natively understand it, then it should not be used. This means that for example no SASS, LESS nor
	TypeScript should be used. Use only pure CSS, HTML and JavaScript.

	<br>

1. **Minimal Dependency on Libraries**

	The central parts of the client side application should be understandable to anyone with a basic knowledge of programming.
	Library specific code should be avoided (for example: React, Vue and Angular).

	<br>

1. **URL Indepence**

	The application should work regardless of the URL that it is hosted on. The application should work 
	without any extra configurations on, for example, example.com, xmpl.com, random.com/application or abc.co/xyz.

	<br>

1. **Ease of Extendability**

	The client side application should be easily extandable and should not impose any unnecessary constraints on coding style
	for the frontend functionality. If something is valid HTML5, then it is valid for the purposes of this application.

	<br>

1. **Browser Compatibility**
    
    The application should be compatible with most standard browsers, except Internet Explorer 11. The JavaScript and CSS
    that would have to be written for IE11 compatibility is just too annoying and since this is mostly meant to be used as
    an internal application, we might as well drop obsolete browsers.

`;

var structureMarkdownContent =
`
1. **core/assets**
    
    Directory that contains the graphical assets.

    <br>

1. **core/css**

    Directory that contains custom CSS.

    <br>

1. **core/js**

    Directory that contains custom JavaScript.

    <br>

1. **core/lib**

    Directory that contains the libraries that have been utilized. The libraries are
    managed manually (aka without a package manager, such as npm) for ease of runnability
    from local files. "No one" wants to install a package manager and "no one" knows how to run
    the dependency resolver from the command line.
    
    <br>

1. **data/jsed**
    
    The directory of the JSED data.

    <br>

1. **data/raw**

    The directory of the raw data. The raw data is completely equivalent to the JSED data,
    but is readable by a human. This data can not and should not be used in the client side
    application. Using the raw data will destroy the ability to run the application directly 
    from local files.

    <br>

1. **views**
    
    The directory that contains the views (aka pages).

    <br>

1. **pwa**

    The directory that contains content related to progressive web applications (PWA).

    <br>

1. **index.html**

    The file from which the client side application is executed. This is the only file that
    should be directly accessed (the browser automatically redirects here). This file contains
    all references to all JavaScript (except the view specific files, which are lazily loaded) 
    and CSS files.

    <br>

1. **initialization.js**

    The initialization logic for the application. This is where the navigation and all the 
    pages are defined.

    <br>

1. **manifest.json**

    The manifest file of the application. 

    <br>

1. **upup.min.js**

    A progressive web application helper library. This file must be kept in the top directory, since
    it can only access file on the same level or below itself.

    <br>

1. **upup.sw.min.js**

    A progressive web application helper library. This file must be kept in the top directory, since
    it can only access file on the same level or below itself.

`;

var implementationMarkdownContent =
`
Here you can find the documentation for main parts of the code that you may have to edit at some point. To make things
explicit the following documentation notation is used for arguments: 

\`\`\`

{{ [TYPE] VARIABLE DESCRIPTION }}

\`\`\`

Where [TYPE] is the type of the argument, and VARIABLE DESCRIPTION is the description of the variable. The double brackets 
{{ }} symbolize the beginning and the end of this documentation notation. These values are to be changed for actual values
in actual code.

Example of conversion from the documentation notation to actual code:

\`\`\`

// Documentation notation
someFunctionThatWantsYourFirstAndLastNameAndAge({{ [STRING] FIRST NAME }}, {{ [STRING] LAST NAME }}, {{ [INTEGER] AGE }});

// Actual code
someFunctionThatWantsYourFirstAndLastNameAndAge('Leevi', 'Olander', 23);

\`\`\`

1. **Initialization**
    
    In **initialization.js** we initialize a few things. First we extract some HTML elements from the default layout defined
    in **index.html** and then we initialize an application variable:

    \`\`\`

    var application = new Application();

    \`\`\`
    
    The **application** variable handles the application state, routing, loading screen, loading of views etc. The routing is based on Vue
    router, but Vue is not used for anything else (due to CORS errors). After all pages have been added and additional configurations made,
    the application is then fully initialized.

    <br>

1. **Creating a New Navigation Menu Item**

    To create a new navigation menu item (in **initialization.js**), use the following syntax:
    
    \`\`\`

    // Syntax
    application.addPage({{ [STRING] PAGE NAME }}, 
                        {{ [STRING] PAGE URL }}, 
                        {{ [STRING] PATH TO VIEW FILE }}, 
                        {{ [DROPDOWN MENU OBJECT] PARENT ITEM (DEFAULT = NULL) }}, 
                        {{ [BOOLEAN] HIDDEN (DEFAULT = FALSE) }});

    // Actual example that adds a page, which is visible in the top navigation bar.
    application.addPage('Products', '/products', 'views/items.js');

    \`\`\`

    To create a new drop down menu and adding a navigation menu item to it (in **initialization.js**), use the following syntax:
    
    \`\`\`

    // Syntax
    var dropDown = application.addDropDown({{ [STRING] DROPDOWN NAME }}, 
                                           {{ [STRING] DROPDOWN URL }});

    application.addPage({{ [STRING] PAGE NAME }}, 
                        {{ [STRING] PAGE URL }}, 
                        {{ [STRING] PATH TO VIEW FILE }}, 
                        dropDown, 
                        {{ [BOOLEAN] HIDDEN (DEFAULT = FALSE) }});

    // Actual example that adds a dropdown and a page, which are visible in the top navigation bar.
    // NOTE: The DROPDOWN URL and PAGE URL should have the same base!
    var dataDropDown = application.addDropDown('Data', '/data');
    application.addPage('Data State', '/data/data-state', 'views/data/data-state.js', dataDropDown);

    \`\`\`
    
    To hide a page, just set the value of **HIDDEN** to **true**. Make sure that the value of **PATH TO VIEW FILE** points to an actual JavaScript file.

    <br>

1. **Creating a New View**
    
    To create a new view (also known as a page), you must first create a new file in the **view** directory. Then use the following syntax
    to display some HTML content:

    \`\`\`

    // Syntax
    application.setContent({{ [STRING OR HTMLELEMENT] HTML CONTENT }}, {{ [BOOLEAN] HIDE LOADING SCREEN (DEFAULT = TRUE) }});

    // Actual example that will display a <h1> element.
    application.setContent('<h1>Hello World</h1>');

    \`\`\`

    During navigation the application will always display a loading screen. Progress can be reported with the following syntax: 

    \`\`\`

    // Syntax
    application.loadingScreen.reportProgress({{ [INTEGER] PROGRESS VALUE (BETWEEN 0-100) }}, {{ [STRING] PROGRESS TEXT }});

    // Actual example that reports progress.
    application.loadingScreen.reportProgress(95, 'Almost done.');

    \`\`\`

    To manually change the state of the loading screen:

    \`\`\`

    // Show the loading screen
    application.loadingScreen.showLoadingScreen();

    // Hide the loading screen
    application.loadingScreen.hideLoadingScreen();

    \`\`\`

    <br>

1. **Creating a Card**

    A card (grey box with heading) is the component in which most of the GUI is contained within in this application. To create
    a card, use the following syntax:

    \`\`\`

    // Syntax
    Card.generateCard({{ [STRING] ID OF ELEMENT IN TO WHICH PLACE THE CARD }}, 
                      {{ [STRING] CARD TITLE }},
                      function (contentElementId)
                      {
	                        // Do something here with contentElementId, which is the id of the
                            // content element of the generated card.
                      }
    );

    // Actual example
    Card.generateCard('implementation', 'Code', function (contentElementId)
    {
	    document.getElementById(contentElementId).innerHTML = converter.makeHtml(implementationMarkdownContent);
    });

    \`\`\`

    To create a card with parameters, which change the behavior of the card in some manner, you must first generate a list
    of input controls. The list of input controls can be defined as HTML strings or as actual HTML elements, however, the
    elements must implement the attributes: **name** and **data-label**. The **data-label** is displayed to the user and
    the **name** is used as a key when returning actual parameter values in associative array.

    \`\`\`

    // Syntax
    Card.generateCardWithParameters({{ [STRING] ID OF ELEMENT IN TO WHICH PLACE THE CARD}}, 
                                    {{ [STRING] CARD TITLE }}, 
                                    {{ [LIST OF HTMLELEMENTS OR LIST OF HTML STRINGS] INPUT ELEMENTS }}, 
                                    function (contentElementId, parameterValues)
	                                {
		                                // Do something here with contentElementId, which is the id of the
                                        // content element of the generated card, and with parameterValues, 
                                        // which is an associative array of the specified parameter values. 
	                                }
    );

    // Actual example
    var parameterInputs = [];
	parameterInputs.push('<input name="maSpan" type="number" data-label="MA Span:" value="10" style="width: 5rem">');
	parameterInputs.push('<input name="minTimesServed" type="number" data-label="Min Times Served:" value="10"');

    Card.generateCardWithParameters('overview-item-table-container', 'Products', parameterInputs, 
    function (contentElementId, parameterValues)
	{
        // Note: parameterValues is in this case an associative array with the following key-value pairs:
        // parameterValues = { 'maSpan': 10, 'minTimesServerd': 10 }
        // getOverviewItemTable(parameterValues) returns an HTML element per the specified parameters.
		document.getElementById(contentElementId).appendChild(getOverviewItemTable(parameterValues));
	});

    \`\`\`

    <br>

1. **Creating a Plot Card**

    A plot card is a standard card with an embedded Plotly chart. To create one, use the following syntax:

    \`\`\`

    // Syntax
    Plot.plotCard({{ [STRING] ID OF ELEMENT IN TO WHICH PLACE THE CARD}}, 
                  {{ [STRING] CARD TITLE }},
                  {{ [FUNCTION] DATA GENERATION CALLBACK (NO ARGUMENTS, RETURNS A LIST OF PLOTLY TRACES) }}, 
                  {{ [PLOTLY LAYOUT OBJECT] LAYOUT CONFIGURATION }}, 
                  {{ [PLOTLY CONFIGURATION OBJECT] PLOT CONFIGURATION }});

    // Actual example
    // generateRevenuePlotData is a function that takes no arguments and
    // returns a list of Plotly traces.
    Plot.plotCard('revenue-plot', 'Revenue', generateRevenuePlotData, {}, {});

    \`\`\`

    To create a plot card with parameters, which change the behavior of the card in some manner, you must first generate a list
    of input controls. The list of input controls can be defined as HTML strings or as actual HTML elements, however, the
    elements must implement the attributes: **name** and **data-label**. The **data-label** is displayed to the user and
    the **name** is used as a key when returning actual parameter values in associative array.

    \`\`\`

    // Syntax
    Plot.plotCardWithParameters({{ [STRING] ID OF ELEMENT IN TO WHICH PLACE THE CARD}},
                                {{ [STRING] CARD TITLE }},
                                {{ [FUNCTION] DATA GENERATION CALLBACK (TAKES AN ASSOC ARRAY AS ARGUMENT, RETURNS A LIST OF PLOTLY TRACES) }}, 
                                {{ [PLOTLY LAYOUT OBJECT] LAYOUT CONFIGURATION }}, 
                                {{ [PLOTLY CONFIGURATION OBJECT] PLOT CONFIGURATION }},
                                {{ [LIST OF HTMLELEMENTS OR LIST OF HTML STRINGS] INPUT ELEMENTS }}
    );

    // Actual example
    var parameterInputs = [];
	parameterInputs.push('<input name="maSpan" type="number" data-label="MA Span:" value="10" style="width: 5rem">');
    
    // getPebblesFeedbackData is a function that takes one associative array as an argument and
    // returns a list of Plotly traces.
    Plot.plotCardWithParameters('pebbles-plot-id', 'Pebbles Feedback', getPebblesFeedbackData, {}, {}, parameterInputs);

    \`\`\`

    See the [documentation for Plotly](plot.ly/javascript/) for how the values **LIST OF PLOTLY TRACES**, **LAYOUT CONFIGURATION** and **PLOT CONFIGURATION** 
    should be configured. The plot card is just a wrapper over these, as such you should be able to do anything that Plotly enables you to do.
    
    <br>

1. **DataHandler**

    **DataHandler** is a class that defines one static function: getSumByDateGroupedByCategory. The function solves a problem in the input data, where
    a single date appears twice with two different values. We only want one value per date, which is why they get summed. 

    \`\`\`

    Example input data:
    2019-12-17, 50, Students
    2019-12-17, 20, Students
    2019-12-17, 20, Non students
    2019-12-18, 50, Students
    2019-12-18, 20, Non students 

    Desired output data:
    2019-12-17, 70, Students
    2019-12-17, 20, Non students
    2019-12-17, 90, Total
    2019-12-18, 50, Students
    2019-12-18, 20, Non students 
    2019-12-18, 70, Total 
    
    \`\`\`

    To use this function, use the following syntax:

    \`\`\`
    
    // Syntax
    DataHandler.getSumByDateGroupedByCategory({{ [LIST OF DATA ITEMS] DATA }}, 
                                              {{ [LIST OF STRINGS] CATEGORIES THAT YOU DEFINETLY WANT }}, 
                                              {{ [STRING] KEY TO THE PROPERTY THAT IS TO BE SUMMED }}, 
                                              {{ [STRING] CATEGORY PROPERTY KEY }}, 
                                              {{ [DATE] START DATE (DEFAULT = 01.01.2000}}, 
                                              {{ [DATE] END DATE (DEFAULT = CURRENT DATE }},
                                              {{ [STRING] DATE PROPERTY KEY (DEFAULT = 'date' }},
                                              {{ [STRING] NAME OF TOTAL CATEGORY (DEFAULT = 'Total' }}
    );

    // Actual example, where data is a list of data items
    DataHandler.getSumByDateGroupedByCategory(data, ['Students', 'Non students'], 'revenue', 'customer_category');

    \`\`\`
`;

var contentElement = document.createElement('div');

contentElement.innerHTML = layout;

application.setContent(contentElement, false);

Card.generateTitleCard(titleCardId, 'Client Side Application Documentation');

Card.generateCard(specificationsCardId, 'Specifications', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(specificationsCardMarkdownContent);
});

Card.generateCard(structureCardId, 'File Structure', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(structureMarkdownContent);
});

Card.generateCard(implementationCardId, 'Code', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(implementationMarkdownContent);
});


application.loadingScreen.loadingCompleted();