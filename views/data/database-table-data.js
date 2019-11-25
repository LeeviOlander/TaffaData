var downloadData = null;

var pageIndex = 0;
var paginationBeginningCount = 2;
var paginationMiddleCount = 3;
var paginationEndCount = 2;

var itemsPerPage = 1000.0;

var progressAfterDownload = 80;
var progressAfterParse = 90;
var progressAfterRender = 100;

function appendPaginationItems(startPageIndex, endPageIndex, currentPageIndex, paginationElement)
{
	for (let i = startPageIndex; i < endPageIndex; i++)
	{
		var paginationItem = document.createElement('a');
		if (i == currentPageIndex)
		{
			paginationItem.className = Css.paginationItemActiveClassNames;
		}
		else
		{
			paginationItem.className = Css.paginationItemClassNames;
		}

		paginationItem.innerHTML = i + 1;
		paginationItem.onclick = function () { pageIndex = i; setPageContent(); };

		paginationElement.appendChild(paginationItem);
	}
}

function createPaginationElement()
{
	var pageCount = Math.ceil(downloadData.data_entries.length / itemsPerPage);

	var paginationElement = document.createElement('nav');
	paginationElement.className = Css.paginationClassNames;

	var paginationPreviousItem = document.createElement('a');
	paginationPreviousItem.className = Css.paginationItemClassNames;
	paginationPreviousItem.innerHTML = 'Previous';
	paginationPreviousItem.onclick = function () { pageIndex--; pageIndex = Math.max(0, pageIndex); setPageContent(); };

	var paginationDotDotItem = document.createElement('a');
	paginationDotDotItem.className = Css.paginationItemClassNames;
	paginationDotDotItem.innerHTML = '...';

	var paginationNextItem = document.createElement('a');
	paginationNextItem.className = Css.paginationItemClassNames;
	paginationNextItem.innerHTML = 'Next';
	paginationNextItem.onclick = function () { pageIndex++; pageIndex = Math.min(pageCount - 1, pageIndex); setPageContent(); };

	var beginningStartIndex = 0;
	var beginningEndIndex = Math.min(paginationBeginningCount, pageCount);
	var middleStartIndex = Math.max(paginationBeginningCount, pageIndex - (paginationMiddleCount - 1) / 2);
	var middleEndIndex = Math.min(pageCount - paginationEndCount, pageIndex + (paginationMiddleCount - 1) / 2 + 1);
	var endStartIndex = Math.max(pageCount - paginationEndCount, paginationBeginningCount);
	var endEndIndex = Math.max(pageCount, paginationBeginningCount);

	var beginningCount = beginningEndIndex - beginningStartIndex;
	var middleCount = middleEndIndex - middleStartIndex;
	var endCount = endEndIndex - endStartIndex;

	paginationElement.appendChild(paginationPreviousItem);

	appendPaginationItems(beginningStartIndex, beginningEndIndex, pageIndex, paginationElement);

	if (beginningEndIndex < middleStartIndex && middleCount > 0)
	{
		paginationElement.appendChild(paginationDotDotItem.cloneNode(true));
	}

	appendPaginationItems(middleStartIndex, middleEndIndex, pageIndex, paginationElement);

	if ((middleEndIndex < endStartIndex && middleCount > 0 && endCount > 0) || (beginningCount > 0 && middleCount <= 0 && endCount > 0 && beginningEndIndex < endStartIndex))
	{
		paginationElement.appendChild(paginationDotDotItem.cloneNode(true));
	}

	appendPaginationItems(endStartIndex, endEndIndex, pageIndex, paginationElement);

	paginationElement.appendChild(paginationNextItem);

	return paginationElement;

}

function createPaginationJumperElement()
{
	var inputGroupElement = document.createElement('div');
	inputGroupElement.className = Css.paginationJumperInputGroupClassNames;

	var inputElement = document.createElement('input');
	inputElement.className = Css.paginationJumperInputElementClassNames;
	inputElement.type = "number";
	inputElement.placeholder = "Page Number";

	var inputAppendElement = document.createElement('div');
	inputAppendElement.className = Css.paginationJumperInputAppendElementClassNames;

	var buttonElement = document.createElement('button');
	buttonElement.className = Css.paginationJumperButtonClassNames;
	buttonElement.innerHTML = 'Jump to Page';
	buttonElement.onclick = function ()
	{
		var pageCount = Math.ceil(downloadData.data_entries.length / itemsPerPage);

		var inputE = buttonElement.parentElement.previousElementSibling;
		var inputValue = inputE.value - 1;

		pageIndex = Math.max(0, Math.min(pageCount - 1, inputValue));

		setPageContent();
	}

	inputAppendElement.appendChild(buttonElement);
	inputGroupElement.appendChild(inputElement);
	inputGroupElement.appendChild(inputAppendElement);

	return inputGroupElement;
}

function setPageContent()
{
	var headingElement = document.createElement('h1');
	headingElement.innerText = 'Database Table "' + Request.getTableName() + '" Data';

	var tableContainerElement = document.createElement('div');
	tableContainerElement.className = Css.responsiveTableContainerClassNames;

	var tableElement = document.createElement('table');
	tableElement.className = Css.databaseTableDataTableClassNames;

	var tableHeadElement = document.createElement('thead');
	var tableHeadRowElement = document.createElement('tr');

	for (var i = 0; i < downloadData.column_names.length; i++)
	{
		var columnName = downloadData.column_names[i];

		var tableHeadingElement = document.createElement('th');
		tableHeadingElement.innerHTML = columnName;

		tableHeadRowElement.appendChild(tableHeadingElement);
	}

	tableHeadElement.appendChild(tableHeadRowElement);
	tableElement.appendChild(tableHeadElement);

	var tableBodyElement = document.createElement('tbody');

	for (var i = pageIndex * itemsPerPage; i < (pageIndex + 1) * itemsPerPage && i < downloadData.data_entries.length; i++)
	{
		var dataEntry = downloadData.data_entries[i];
		var tableRowElement = document.createElement('tr');

		for (var j = 0; j < dataEntry.length; j++)
		{
			var tableDataElement = document.createElement('td');
			tableDataElement.innerHTML = dataEntry[j];

			tableRowElement.appendChild(tableDataElement);
		}

		tableBodyElement.appendChild(tableRowElement);
	}
	tableElement.appendChild(tableBodyElement);

	tableContainerElement.appendChild(tableElement);

	var contentElement = document.createElement('div');
	contentElement.appendChild(headingElement);
	contentElement.appendChild(createPaginationElement());
	contentElement.appendChild(createPaginationJumperElement());
	contentElement.appendChild(tableContainerElement);
	contentElement.appendChild(createPaginationElement());
	contentElement.appendChild(createPaginationJumperElement());

	application.loadingScreen.reportProgress(progressAfterRender, 'Data rendered.');
	application.setContentElement(contentElement);
}

var dataDownloadRequest = new XMLHttpRequest();

dataDownloadRequest.onload = function ()
{
	application.loadingScreen.reportProgress(progressAfterDownload, 'Data download completed.');

	downloadData = JSON.parse(dataDownloadRequest.response);

	application.loadingScreen.reportProgress(progressAfterParse, 'Data parsed.');

	setPageContent();
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
		var percent = (e.loaded / e.total) * progressAfterDownload;

		application.loadingScreen.reportProgress(percent, 'Downloading data.');
	}
};

application.loadingScreen.reportProgress(0, 'Data download starting.');
dataDownloadRequest.open('GET', ServerUrlGenerator.databaseTableDataGetUrl(Request.getTableName()));
dataDownloadRequest.send(null);


