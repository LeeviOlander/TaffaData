var converter = new showdown.Converter();

var titleCardId = 'title';
var devCardId = 'dev';

var layout =
`
    <div class="row">
        <div class="col-12" id="${titleCardId}">
        </div>
        <div class="col-12" id="${devCardId}">
        </div>
    </div>
`;

var localMarkdownContent =
`	

You may download a local version of the application here. The application has no dependencies, except that you use 
a somewhat modern browser. The application does not work on Internet Explorer 11. To run the application, download
and extract the zip file that is linked below. Then open **index.html** in a browser. The application is not dependent
on compilation, which means that just by editing the source files you can edit the functionality. Note: The most 
current data has automatically been bundled to this package.

<br>

**[Source Files + Data](${Urls.developmentPackageUrl})**

<br>

The source code can also be found on GitHub, but cloning the repo you must configure an Apache webserver with PHP. Additionally, 
you must configure the authentication settings and connections to the database. By downloading the above zip file, you
will save yourself some trouble.

<br>

**[GitHub Repository](${Urls.githubRepoUrl})**

`;

var contentElement = document.createElement('div');

contentElement.innerHTML = layout;

application.setContent(contentElement, false);

Card.generateTitleCard(titleCardId, 'Development');

Card.generateCard(devCardId, 'Local Development', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(localMarkdownContent);
});



application.loadingScreen.loadingCompleted();