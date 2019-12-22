var converter = new showdown.Converter();

var titleCardId = 'title';
var structureCardId = 'structure';
var techCardId = 'tech';
var authCardId = 'tech';

var layout =
`
    <div class="row">
        <div class="col-12" id="${titleCardId}">
        </div>
        <div class="col-12" id="${structureCardId}">
        </div>
        <div class="col-12" id="${techCardId}">
        </div>
        <div class="col-12" id="${authCardId}">
        </div>
    </div>
`;

var technologiesMarkdownContent =
`
The backend is built with PHP, which connects to a MySQL database. The data is extracted and packed in to the 
JSED file format (which fixes CORS errors when executing from local files). No libraries are used.
`;

var structureMarkdownContent =
`
1. **server/core**

    This directory contains most of the functions and classes used by the backend. The most important file is
    **includes.php**, which states what files are imported and in what order. The backend implementation is 
    quite simple and should be easy to analyze in depth.

    <br>

1. **server/public-settings**

    This directory contains public settings that are used in the backend application.

    <br>

1. **server/secret-settings**

    This directory contains secret settings that are used in the backend application. The secret
    settings are **ignored** by GIT.

    <br>

1. **server/database-info.php**

    Echoes some information about the database. Not used for anything else than debugging.

    <br>

1. **server/database-table-data.php**

    Echoes the contents of a database table as JSON.

    <br>

1. **server/database-tables.php**

    Echoes all the tables in the database as JSON.

    <br>

1. **server/login.php**

    The sign in implementation and GUI.

    <br>

1. **server/update-data-if-needed.php**

    Updates the data on the server if needed. The update frequency is configured in **server/public-settings**.

    <br>

1. **server/update-data.php**

    Updates the data. You must have admin access to directly run the data update process.

`;

var authMarkdownContent =
`

1. **.htaccess**

    The .htaccess file rewrites ALL requests, except those ending with **index.php**, to pass through **index.php**.

    <br>

1. **index.php**

    This file checks whether you are authenticated or not. If not, then the contents of the login page will be displayed,
    otherwise you get the actual requested content.

    <br>

The main authentication logic can be found in the files **server/core/php/authentication.php** and **server/login.php**. The
users authenticate themselves via LDAP.

`;

var contentElement = document.createElement('div');

contentElement.innerHTML = layout;

application.setContent(contentElement, false);

Card.generateTitleCard(titleCardId, 'Server Side Application Documentation');

Card.generateCard(structureCardId, 'File Structure', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(structureMarkdownContent);
});

Card.generateCard(techCardId, 'Technologies', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(technologiesMarkdownContent);
});

Card.generateCard(authCardId, 'Authentication', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(authMarkdownContent);
});



application.loadingScreen.loadingCompleted();