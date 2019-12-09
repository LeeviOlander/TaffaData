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
someFunctionThatWantsYourFirstAndLastNameAndAge('Leevi', 'Olander', '23');

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

1. **Creating a New Page**

    To create a new page (in **initialization.js**), use the following syntax:
    
    \`\`\`

    // Syntax
    application.addPage({{ [STRING] PAGE NAME }}, {{ [STRING] PAGE URL }}, {{ [STRING] PATH TO VIEW FILE }}, {{ [BOOLEAN] HIDDEN OR NOT (FALSE BY DEFAULT) }});

    // Actual example that adds a page, which is visible in the top navigation bar.
    application.addPage('Products', '/products', 'views/items.js');

    // Actual example that adds a page, which is not visible in the top navigation bar..
    application.addPage('Products', '/products', 'views/items.js');

    \`\`\`

    Where 
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