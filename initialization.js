var vueViewElement = document.getElementById('vue-view');
var contentElement = document.getElementById('content');
var navigationElement = document.getElementById('navigation');

var loadingElement = document.getElementById('loading-screen');
var loadingProgressBarProgressElement = document.getElementById('loading-progress-bar-progress');
var loadingOutputElement = document.getElementById('loading-output');

var unitSelectHtml =
`
    <select name="unit" data-label="Unit: ">
        <option value="quantity_sold">
            Quantity
        </option>
        <option value="revenue">
            Revenue (€)
        </option>
    </select>
`;

var application = new Application();

Urls.databaseTableDataViewUrlBase = '/data/database-table-data';

// Page Initialization
// The NAME will be displayed to the user, the URL will be the suffix in the
// web browser address bar and FILE is the file from which the content gets
// pulled.
//                  NAME                URL                 FILE
application.addPage('Home',				'/',				'views/home.js');
application.addPage('Products',			'/products',		'views/items.js');
application.addPage('Categories',       '/categories',		'views/items.js');

var dataDropDown = application.addDropDown('Data', '/data');
application.addPage('Data State', '/data/data-state', 'views/data/data-state.js', dataDropDown);
application.addPage('Database Tables', '/data/database-tables', 'views/data/database-tables.js', dataDropDown);
application.addPage('Database Table Data', Urls.databaseTableDataViewUrlBase, 'views/data/database-table-data.js', dataDropDown, true);

var documentationDropDown = application.addDropDown('Documentation', '/documentation');
application.addPage('General',                  '/documentation/general',                   'views/documentation/general.js',                   documentationDropDown);
application.addPage('Client Side Application',  '/documentation/client-side-application',   'views/documentation/client-side-application.js',   documentationDropDown);
application.addPage('Server Side Application',  '/documentation/server-side-application',   'views/documentation/server-side-application.js',   documentationDropDown);

application.initializeLoadingScreen(loadingElement, loadingProgressBarProgressElement, loadingOutputElement);
application.initializeNavigation(navigationElement);
application.initializeContent(contentElement);
application.initializeVue(vueViewElement);