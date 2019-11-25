
var downloadTimeShareEstimate = 0.8;
var renderingTimeShareEstimeate = 1 - downloadTimeShareEstimate;

var dataDownloadRequest = new XMLHttpRequest();

dataDownloadRequest.onload = function ()
{
	var tables = JSON.parse(dataDownloadRequest.response);

	var headingElement = document.createElement('h1');
	headingElement.innerText = 'Database Tables';

	var tableContainerContainerElement = document.createElement('div');
	tableContainerContainerElement.className = Css.databaseTableContainerContainerClassNames;

	for (var i = 0; i < tables.length; i++)
	{
		var table = tables[i];

		var tableGridCellElement = document.createElement('div');
		tableGridCellElement.className = Css.databaseTableGridCellClassNames;

		var tableContainerElement = document.createElement('div');
		tableContainerElement.className = Css.databaseTableContainerClassNames;

		var tableContainerHeaderElement = document.createElement('div');
		tableContainerHeaderElement.className = Css.databaseTableContainerHeaderClassNames;
		tableContainerHeaderElement.innerHTML = table.table_name;

		var tableContainerBodyElement = document.createElement('div');
		tableContainerBodyElement.className = Css.databaseTableContainerBodyClassNames;

		var tableColumnsListElement = document.createElement('ul');
		tableColumnsListElement.className = Css.databaseTableContainerColumnListClassNames;

		for (var j = 0; j < table.table_columns.length; j++)
		{
			var columnElement = document.createElement('li');

			columnElement.innerText = table.table_columns[j];

			tableColumnsListElement.appendChild(columnElement);
		}

		var tableContainerAnchorElement = document.createElement('a');
		tableContainerAnchorElement.className = Css.databaseTableContainerShowDataAnchorClassNames;
		tableContainerAnchorElement.href = UrlGenerator.databaseTableDataViewUrl(table.table_name);
		tableContainerAnchorElement.innerHTML = 'Show data';

		tableContainerBodyElement.appendChild(tableColumnsListElement);
		tableContainerBodyElement.appendChild(tableContainerAnchorElement);

		tableContainerElement.appendChild(tableContainerHeaderElement);
		tableContainerElement.appendChild(tableContainerBodyElement);

		tableGridCellElement.appendChild(tableContainerElement);

		tableContainerContainerElement.appendChild(tableGridCellElement);

	}

	application.loadingScreen.reportProgress(100, 'Data loaded and rendered.');
	application.setContent(headingElement.outerHTML + tableContainerContainerElement.outerHTML);

};

dataDownloadRequest.onerror = function ()
{
	application.loadingScreen.reportProgress(100, 'Data request error');
	application.loadingScreen.loadingCompleted();
};

dataDownloadRequest.onprogress = function (e)
{
	if (e.lengthComputable)
	{
		var percent = (e.loaded / e.total) * 100 * downloadTimeShareEstimate;

		application.loadingScreen.reportProgress(percent, 'Data download completed.');
	}
};

application.loadingScreen.reportProgress(0, 'Data download starting.');

dataDownloadRequest.open('GET', ServerUrlGenerator.databaseTableInformationGetUrl());
dataDownloadRequest.send(null);


