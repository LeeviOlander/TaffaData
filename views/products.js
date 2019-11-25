// Global variables

var progressAfterProductListLoaded = 10;
var progressAfterProductDataLoaded = 70;
var progressAfterOverviewDataLoaded = 70;
var progressAfterRender = 100;

var productListPath = 'data/jsed/product-list.jsed';
var productDataPathPrefix = 'data/jsed/products/';
var productDataPathSuffix = '.jsed';

var overviewString = 'Overview';
var selectedGetParameter = 'selected';
var productSelectElementId = 'product-select';

var overviewPlotId = 'overview-mean-std';
var overviewProductTableContainerId = 'overview-product-table-container';
var overviewProductTableId = 'overview-product-table';

var productSalesPlotId = 'product-sales';
var productSalesHistogramPlotId = 'product-sales-histogram';

var productNames = [];
var productDataJsedResultsByName = {};
var selectedProductDataJsedResult = null;

// Layouts

var overviewLayout = 
`
    <div class="row">
        <div class="col-12" id="${overviewPlotId}">
        </div>
        <div class="col-12" id="${overviewProductTableContainerId}">
        </div>
    </div>
`;

var productLayout =
`
   <div class="row">
        <div class="col-12" id="${productSalesPlotId}">
        </div>
        <div class="col-12" id="${productSalesHistogramPlotId}">
        </div>
        <div class="col-12" id="${overviewProductTableContainerId}">
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

function generateProductSelectElement()
{
	var selectElement = document.createElement('select');
	selectElement.id = productSelectElementId;
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

	for (var i = 0; i < productNames.length; i++)
	{
		var productName = productNames[i];

		var optionElement = document.createElement('option');
		optionElement.value = productName;
		optionElement.innerHTML = productName;

		if (productName == selected)
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
	application.loadingScreen.reportProgress(progressAfterProductListLoaded, 'Product list loaded.');

    // Wrap in timeout so that the browser surely can render the loading screen
	setTimeout(function ()
	{
	    var selectedItemName = Request.get(selectedGetParameter);
	    var overview = selectedItemName == null || selectedItemName == '' || selectedItemName == overviewString;

	    var contentElement = document.createElement('div');
	    contentElement.appendChild(generateProductSelectElement());

	    if (overview)
	    {
		    loadOverviewData(renderOverview);
	    }
	    else
	    {
		    loadProductData(selectedItemName, renderProduct);
		}
	}, 100);

}

function renderProduct()
{
	var selectedItemName = Request.get(selectedGetParameter);

	var contentElement = document.createElement('div');
	contentElement.appendChild(generateProductSelectElement());

	contentElement.insertAdjacentHTML('beforeend', productLayout);

	application.setContentElement(contentElement, false);

	selectedProductDataJsedResult = productDataJsedResultsByName[selectedItemName];

	var parameterInputs = [];
	parameterInputs.push(`<input name="maSpan" type="number" data-label="MA Span:" value="1">`);

	Plot.plotCardWithParameters(productSalesPlotId, 'Sales', getProductSalesData, {}, {}, parameterInputs);

	var histogramParameterInputs = [];
	histogramParameterInputs.push(`<input name="bins" type="number" data-label="Bins:" value="100">`);
	histogramParameterInputs.push(`<input name="startDate" type="date" data-label="Start Date:" value="2000-01-01"  style="width: 7rem">`);
	histogramParameterInputs.push(`<input name="endDate" type="date" data-label="End Date:" value="${new Date().toJSON().slice(0, 10)}" style="width: 7rem">`);

	Plot.plotCardWithParameters(productSalesHistogramPlotId, 'Distribution of Sales', getProductSalesHistogramData, {}, {}, histogramParameterInputs);

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
		contentElement.appendChild(generateProductSelectElement());

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

		Card.generateCardWithParameters(overviewProductTableContainerId, 'Products', parameterInputs, function (contentElementId, parameterValues)
		{
			document.getElementById(contentElementId).appendChild(getOverviewProductTable(parameterValues));
			new Tablesort(document.getElementById(overviewProductTableId));
		});

		application.loadingScreen.reportProgress(progressAfterRender, 'Rendering completed');
		application.loadingScreen.hideLoadingScreen();

	}, 100);

}

// Data loading functions

function getProductDataPath(productName)
{
	return productDataPathPrefix + productName + productDataPathSuffix;
}

function loadProductData(productName, onComplete)
{
	JSED.parse(getProductDataPath(productName), function (productDataJsedResult)
	{
		productDataJsedResultsByName[productName] = productDataJsedResult;
		onComplete();
	});
}

function loadOverviewData(onComplete)
{
	var completed = 0;
	var c = productNames.length;
	for (let i = 0; i < c; i++)
	{
		let productName = productNames[i];

		loadProductData(productName, function ()
		{
			var progress = Math.round(progressAfterProductListLoaded + (progressAfterOverviewDataLoaded - progressAfterProductListLoaded) * completed / productNames.length);
			application.loadingScreen.reportProgress(progress, 'Loaded data for product: ' + productName);

			completed++;
			if (completed >= c)
			{
				onComplete();
			}
		});
	}
}

// Data generation functions

function getProductSalesData(params)
{
	var maSpan = params.maSpan;

	var productData = selectedProductDataJsedResult.getAny().data;

	var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(productData, ['Students', 'Non students'], 'amount_sold', 'customer_category');

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

function getProductSalesHistogramData(params)
{
	var bins = params.bins;
	var startDate = params.startDate;
	var endDate = params.endDate;

	var productData = selectedProductDataJsedResult.getAny().data;

	var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(productData, ['Students', 'Non students'], 'amount_sold', 'customer_category', startDate, endDate);

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

	for (var productJsedResultName in productDataJsedResultsByName)
	{
		var productJsedResult = productDataJsedResultsByName[productJsedResultName];
		var productData = productJsedResult.getAny().data;

		var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(productData, ['Students', 'Non students'], 'amount_sold', 'customer_category', startDate, endDate);

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

			dataLabels.push(Path.basenameWithoutFileExtension(productJsedResult.src));
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

function getOverviewProductTable(params)
{
	var minTimesServed = params.minTimesServed;
	var startDate = params.startDate;
	var endDate = params.endDate;

	var productTable = document.createElement('table');
	productTable.className = Css.overviewTableClassNames;
	productTable.id = overviewProductTableId;

	productTable.innerHTML +=
	`
        <thead>
            <tr>
                <th>
                    Product Name
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

	for (var productJsedResultName in productDataJsedResultsByName)
	{
		var productJsedResult = productDataJsedResultsByName[productJsedResultName];
		var productData = productJsedResult.getAny().data;

		var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(productData, ['Students', 'Non students'], 'amount_sold', 'customer_category', startDate, endDate);

		var totalDates = Object.keys(amountSoldByDateGroupedByCategory['Total']);

		if (totalDates.length < minTimesServed)
		{
			continue;
		}

		var amountTotalValues = Object.values(amountSoldByDateGroupedByCategory['Total']);
		var amountStudentValues = Object.values(amountSoldByDateGroupedByCategory['Students']);
		var amountNonStudentValues = Object.values(amountSoldByDateGroupedByCategory['Non students']);


		var getParams = {};
		getParams[selectedGetParameter] = productJsedResultName;

		var tableRowInnerHtml = 
		`
            <td>
                <a href="${UrlGenerator.getCurrentUrlWithGetParameters(getParams)}">
                    ${productJsedResultName}
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

	productTable.appendChild(tableBodyElement);

	return productTable;
}

// Initialization call
// Load the item list and then render according to selection.

JSED.parse(productListPath, function (productListJsedResult)
{
	productNames = productListJsedResult.getAny().data.sort();

	render();

	window.onhashchange = render; 

});

