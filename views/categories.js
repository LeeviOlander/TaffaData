// Global variables

var progressAfterCategoryListLoaded = 10;
var progressAfterCategoryDataLoaded = 70;
var progressAfterOverviewDataLoaded = 70;
var progressAfterRender = 100;

var categoryListPath = 'data/jsed/category-list.jsed';
var categoryDataPathPrefix = 'data/jsed/categories/';
var categoryDataPathSuffix = '.jsed';

var overviewString = 'Overview';
var selectedGetParameter = 'selected';
var categorySelectElementId = 'category-select';

var overviewPlotId = 'overview-mean-std';
var overviewFeedbackPlotId = 'overview-category-table-container';
var overviewCategoryTableId = 'overview-category-table';

var categorySalesPlotId = 'category-sales';
var categorySalesHistogramPlotId = 'category-sales-histogram';

var categoryNames = [];
var categoryDataJsedResultsByName = {};
var selectedCategoryDataJsedResult = null;

// Layouts

var overviewLayout =
	`
    <div class="row">
        <div class="col-12" id="${overviewPlotId}">
        </div>
        <div class="col-12" id="${overviewFeedbackPlotId}">
        </div>
    </div>
`;

var categoryLayout =
	`
   <div class="row">
        <div class="col-12" id="${categorySalesPlotId}">
        </div>
        <div class="col-12" id="${categorySalesHistogramPlotId}">
        </div>
        <div class="col-12" id="${overviewFeedbackPlotId}">
        </div>
    </div> 
`;


// Navigation

function navigateToSelection(selectedItem)
{
	var getParams = {};
	getParams[selectedGetParameter] = selectedItem;
	window.location.href = UrlGenerator.getCurrentUrlWithGetParameters(getParams);
}

function generateCategorySelectElement()
{
	var selectElement = document.createElement('select');
	selectElement.id = categorySelectElementId;
	selectElement.className = Css.selectClassNames;
	selectElement.onchange = function ()
	{
		navigateToSelection(selectElement.options[selectElement.selectedIndex].value);
	};

	var overviewOptionElement = document.createElement('option');
	overviewOptionElement.value = overviewString;
	overviewOptionElement.innerHTML = overviewString;

	selectElement.appendChild(overviewOptionElement);

	var selected = Request.get(selectedGetParameter);

	for (var i = 0; i < categoryNames.length; i++)
	{
		var categoryName = categoryNames[i];

		var optionElement = document.createElement('option');
		optionElement.value = categoryName;
		optionElement.innerHTML = categoryName;

		if (categoryName == selected)
		{
			optionElement.selected = 'selected';
		}

		selectElement.appendChild(optionElement);
	}

	return selectElement;

}

// Render functions

function render()
{
	application.loadingScreen.showLoadingScreen();
	application.loadingScreen.reportProgress(progressAfterCategoryListLoaded, 'Category list loaded.');

	// Wrap in timeout so that the browser surely can render the loading screen
	setTimeout(function ()
	{
		var selectedItemName = Request.get(selectedGetParameter);
		var overview = selectedItemName == null || selectedItemName == '' || selectedItemName == overviewString;

		var contentElement = document.createElement('div');
		contentElement.appendChild(generateCategorySelectElement());

		if (overview)
		{
			loadOverviewData(renderOverview);
		}
		else
		{
			loadCategoryData(selectedItemName, renderCategory);
		}
	}, 100);

}

function renderCategory()
{
	var selectedItemName = Request.get(selectedGetParameter);

	var contentElement = document.createElement('div');
	contentElement.appendChild(generateCategorySelectElement());

	contentElement.insertAdjacentHTML('beforeend', categoryLayout);

	application.setContentElement(contentElement, false);

	selectedCategoryDataJsedResult = categoryDataJsedResultsByName[selectedItemName];

	var parameterInputs = [];
	parameterInputs.push(`<input name="maSpan" type="number" data-label="MA Span:" value="30">`);

	Plot.plotCardWithParameters(categorySalesPlotId, 'Sales', getCategorySalesData, {}, {}, parameterInputs);

	var histogramParameterInputs = [];
	histogramParameterInputs.push(`<input name="bins" type="number" data-label="Bins:" value="100">`);
	histogramParameterInputs.push(`<input name="startDate" type="date" data-label="Start Date:" value="2000-01-01"  style="width: 7rem">`);
	histogramParameterInputs.push(`<input name="endDate" type="date" data-label="End Date:" value="${new Date().toJSON().slice(0, 10)}" style="width: 7rem">`);

	Plot.plotCardWithParameters(categorySalesHistogramPlotId, 'Distribution of Sales', getCategorySalesHistogramData, {}, {}, histogramParameterInputs);

	application.loadingScreen.reportProgress(progressAfterRender, 'Rendering completed');
	application.loadingScreen.hideLoadingScreen();
}

function renderOverview()
{
	// Wrap in time out, so that browser may rerender the loading screen.
	// The rendering process is so slow that this is needed.
	setTimeout(function ()
	{
		var contentElement = document.createElement('div');
		contentElement.appendChild(generateCategorySelectElement());

		contentElement.insertAdjacentHTML('beforeend', overviewLayout);

		application.setContentElement(contentElement, false);

		var meanStdLayoutOptions =
		{
			xaxis:
			{
				title:
				{
					text: 'STD of Sales'
				},
			},
			yaxis:
			{
				title:
				{
					text: 'Mean of Sales'
				}
			}
		};

		//Plot.plotWithOneParameter('Mean & Standard Deviation of Sales All Time', overviewMeanStdPlotId, getOverviewMeanStdData, meanStdLayoutOptions, {}, 10, 'Min Times Served');

		var parameterInputs = [];
		parameterInputs.push(`<input name="minTimesServed" type="number" data-label="Min Times Served:" value="10" style="width: 4rem">`);
		parameterInputs.push(`<input name="startDate" type="date" data-label="Start Date:" value="2000-01-01"  style="width: 7rem">`);
		parameterInputs.push(`<input name="endDate" type="date" data-label="End Date:" value="${new Date().toJSON().slice(0, 10)}" style="width: 7rem">`);

		Plot.plotCardWithParameters(overviewPlotId, 'Mean & Standard Deviation of Sales', getOverviewMeanStdData, meanStdLayoutOptions, {}, parameterInputs);

		Card.generateCardWithParameters(overviewFeedbackPlotId, 'Categories', parameterInputs, function (contentElementId, parameterValues)
		{
			document.getElementById(contentElementId).appendChild(getOverviewCategoryTable(parameterValues));
			new Tablesort(document.getElementById(overviewCategoryTableId));
		});

		application.loadingScreen.reportProgress(progressAfterRender, 'Rendering completed');
		application.loadingScreen.hideLoadingScreen();

	}, 100);

}

// Data loading functions

function getCategoryDataPath(categoryName)
{
	return categoryDataPathPrefix + categoryName + categoryDataPathSuffix;
}

function loadCategoryData(categoryName, onComplete)
{
	JSED.parse(getCategoryDataPath(categoryName), function (categoryDataJsedResult)
	{
		categoryDataJsedResultsByName[categoryName] = categoryDataJsedResult;
		onComplete();
	});
}

function loadOverviewData(onComplete)
{
	var completed = 0;
	var c = categoryNames.length;
	for (let i = 0; i < c; i++)
	{
		let categoryName = categoryNames[i];

		loadCategoryData(categoryName, function ()
		{
			var progress = Math.round(progressAfterCategoryListLoaded + (progressAfterOverviewDataLoaded - progressAfterCategoryListLoaded) * completed / categoryNames.length);
			application.loadingScreen.reportProgress(progress, 'Loaded data for category: ' + categoryName);

			completed++;
			if (completed >= c)
			{
				onComplete();
			}
		});
	}
}

// Data generation functions

function getCategorySalesData(params)
{
	var maSpan = params.maSpan;

	var categoryData = selectedCategoryDataJsedResult.getAny().data;

	var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(categoryData, ['Students', 'Non students'], 'amount_sold', 'customer_category');

	var datesTotal = Object.keys(amountSoldByDateGroupedByCategory['Total']);
	var datesStudents = Object.keys(amountSoldByDateGroupedByCategory['Students']);
	var datesNonStudents = Object.keys(amountSoldByDateGroupedByCategory['Non students']);

	var amountTotalValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByCategory['Total']), maSpan);
	var amountStudentValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByCategory['Students']), maSpan);
	var amountNonStudentValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByCategory['Non students']), maSpan);

	var traces = [];

	var traceTotal =
	{
		x: datesTotal,
		y: amountTotalValues,
		type: 'scatter',
		name: 'Total'
	};

	var traceStudents =
	{
		x: datesStudents,
		y: amountStudentValues,
		type: 'scatter',
		name: 'Students'
	};

	var traceNonStudents =
	{
		x: datesNonStudents,
		y: amountNonStudentValues,
		type: 'scatter',
		name: 'Non students'
	};

	traces.push(traceTotal);
	traces.push(traceStudents);
	traces.push(traceNonStudents);

	return traces;
}

function getCategorySalesHistogramData(params)
{
	var bins = params.bins;
	var startDate = params.startDate;
	var endDate = params.endDate;

	var categoryData = selectedCategoryDataJsedResult.getAny().data;

	var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(categoryData, ['Students', 'Non students'], 'amount_sold', 'customer_category', startDate, endDate);

	var amountTotalValues = Object.values(amountSoldByDateGroupedByCategory['Total']);
	var amountStudentValues = Object.values(amountSoldByDateGroupedByCategory['Students']);
	var amountNonStudentValues = Object.values(amountSoldByDateGroupedByCategory['Non students']);

	var minVal = math.min(math.min(amountStudentValues), math.min(amountNonStudentValues));
	var maxVal = math.max(amountTotalValues);

	var traces = [];

	var traceTotal =
	{
		x: amountTotalValues,
		autobinx: false,
		xbins:
		{
			start: minVal,
			end: maxVal,
			size: (maxVal - minVal) / bins
		},
		type: 'histogram',
		name: 'Total'
	};

	var traceStudents =
	{
		x: amountStudentValues,
		autobinx: false,
		xbins:
		{
			start: minVal,
			end: maxVal,
			size: (maxVal - minVal) / bins
		},
		type: 'histogram',
		name: 'Students'
	};

	var traceNonStudents =
	{
		x: amountNonStudentValues,
		autobinx: false,
		xbins:
		{
			start: minVal,
			end: maxVal,
			size: (maxVal - minVal) / bins
		},
		type: 'histogram',
		name: 'Non students'
	};

	traces.push(traceTotal);
	traces.push(traceStudents);
	traces.push(traceNonStudents);

	return traces;
}

function getOverviewMeanStdData(params)
{
	var minTimesServed = params.minTimesServed;
	var startDate = params.startDate;
	var endDate = params.endDate;

	var meanAmountStudent = [];
	var stdAmountStudent = [];

	var meanAmountNonStudent = [];
	var stdAmountNonStudent = [];

	var meanAmountTotal = [];
	var stdAmountTotal = [];

	var dataLabels = [];

	for (var categoryJsedResultName in categoryDataJsedResultsByName)
	{
		var categoryJsedResult = categoryDataJsedResultsByName[categoryJsedResultName];
		var categoryData = categoryJsedResult.getAny().data;

		var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(categoryData, ['Students', 'Non students'], 'amount_sold', 'customer_category', startDate, endDate);

		var amountTotalValues = Object.values(amountSoldByDateGroupedByCategory['Total']);
		var amountStudentValues = Object.values(amountSoldByDateGroupedByCategory['Students']);
		var amountNonStudentValues = Object.values(amountSoldByDateGroupedByCategory['Non students']);

		if (amountTotalValues.length >= minTimesServed)
		{
			meanAmountStudent.push(math.mean(amountStudentValues));
			stdAmountStudent.push(math.std(amountStudentValues));

			meanAmountNonStudent.push(math.mean(amountNonStudentValues));
			stdAmountNonStudent.push(math.std(amountNonStudentValues));

			meanAmountTotal.push(math.mean(amountTotalValues));
			stdAmountTotal.push(math.std(amountTotalValues));

			dataLabels.push(Path.basenameWithoutFileExtension(categoryJsedResult.src));
		}

	}

	var traces = [];

	var traceTotal =
	{
		x: stdAmountTotal,
		y: meanAmountTotal,
		text: dataLabels,
		mode: 'markers',
		type: 'scatter',
		name: 'Total'
	};

	var traceStudents =
	{
		x: stdAmountStudent,
		y: meanAmountStudent,
		text: dataLabels,
		mode: 'markers',
		type: 'scatter',
		name: 'Students'
	};

	var traceNonStudents =
	{
		x: stdAmountNonStudent,
		y: meanAmountNonStudent,
		text: dataLabels,
		mode: 'markers',
		type: 'scatter',
		name: 'Non students'
	};


	traces.push(traceTotal);
	traces.push(traceStudents);
	traces.push(traceNonStudents);

	return traces;
}

function getOverviewCategoryTable(params)
{
	var minTimesServed = params.minTimesServed;
	var startDate = params.startDate;
	var endDate = params.endDate;

	var categoryTable = document.createElement('table');
	categoryTable.className = Css.overviewTableClassNames;
	categoryTable.id = overviewCategoryTableId;

	categoryTable.innerHTML +=
		`
        <thead>
            <tr>
                <th>
                    Category Name
                </th>
                <th>
                    Times Served
                </th>
                <th>
                    Last Served
                </th>
                <th>
                    Min Sold
                </th>
                <th>
                    Max Sold
                </th>
                <th>
                    Mean Amount Sold
                </th>
                <th>
                    Total Trend
                </th>
                <th>
                    Students Trend
                </th>
                <th>
                    Non Students Trend
                </th>
            </tr>
        </thead>
    `;

	var tableBodyElement = document.createElement('tbody');

	for (var categoryJsedResultName in categoryDataJsedResultsByName)
	{
		var categoryJsedResult = categoryDataJsedResultsByName[categoryJsedResultName];
		var categoryData = categoryJsedResult.getAny().data;

		var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(categoryData, ['Students', 'Non students'], 'amount_sold', 'customer_category', startDate, endDate);

		var totalDates = Object.keys(amountSoldByDateGroupedByCategory['Total']);

		if (totalDates.length < minTimesServed)
		{
			continue;
		}

		var amountTotalValues = Object.values(amountSoldByDateGroupedByCategory['Total']);
		var amountStudentValues = Object.values(amountSoldByDateGroupedByCategory['Students']);
		var amountNonStudentValues = Object.values(amountSoldByDateGroupedByCategory['Non students']);


		var getParams = {};
		getParams[selectedGetParameter] = categoryJsedResultName;

		var tableRowInnerHtml =
			`
            <td>
                <a href="${UrlGenerator.getCurrentUrlWithGetParameters(getParams)}">
                    ${categoryJsedResultName}
                </a>
            </td>
            <td>
                ${amountTotalValues.length}
            </td>
            <td>
                ${totalDates[totalDates.length - 1]}
            </td>
            <td>
                ${math.round(math.min(amountTotalValues), 2)}
            </td>
            <td>
                ${math.round(math.max(amountTotalValues), 2)}
            </td>
            <td>
                ${math.round(math.mean(amountTotalValues), 2)}
            </td>
            <td>
                ${math.round(Statistics.linearRegression(amountTotalValues).slope, 2)}
            </td>
            <td>
                ${math.round(Statistics.linearRegression(amountStudentValues).slope, 2)}
            </td>
            <td>
                ${math.round(Statistics.linearRegression(amountNonStudentValues).slope, 2)}
            </td>
        `;

		var tableRow = document.createElement('tr');
		tableRow.innerHTML = tableRowInnerHtml;

		tableBodyElement.appendChild(tableRow);
	}

	categoryTable.appendChild(tableBodyElement);

	return categoryTable;
}

// Initialization call
// Load the item list and then render according to selection.

JSED.parse(categoryListPath, function (categoryListJsedResult)
{
	categoryNames = categoryListJsedResult.getAny().data.sort();

	render();

	window.onhashchange = render;

});

