// Global variables

var progressAfterItemListLoaded = 10;
var progressAfterItemDataLoaded = 70;
var progressAfterOverviewDataLoaded = 70;
var progressAfterRender = 100;

if (window.location.hash.includes('categories'))
{
	var overviewString = 'Categories Overview';
	var itemTableCardHeading = 'Categories';
	var itemListPath = 'data/jsed/category-list.jsed';
	var itemDataPathPrefix = 'data/jsed/categories/';
	var itemDataPathSuffix = '.jsed';
}
else if (window.location.hash.includes('products'))
{
	var overviewString = 'Products Overview';
	var itemTableCardHeading = 'Products';
	var itemListPath = 'data/jsed/product-list.jsed';
	var itemDataPathPrefix = 'data/jsed/products/';
	var itemDataPathSuffix = '.jsed';
}

var selectedGetParameter = 'selected';
var itemSelectElementId = 'item-select';

var overviewPlotId = 'overview-mean-std';
var overviewCumulativePlotId = 'overview-cumulative';
var overviewitemTableContainerId = 'overview-item-table-container';
var overviewItemTableId = 'overview-item-table';
var overviewItemTableBodyId = 'overview-item-table-body';

var itemSalesPlotId = 'item-sales';
var itemSalesHistogramPlotId = 'item-sales-histogram';

var itemNames = [];
var itemDataJsedResultsByName = {};
var selectedItemDataJsedResult = null;

var checkedItemNames = {};

// Layouts

var overviewLayout =
`
    <div class="row">
        <div class="col-12" id="${overviewPlotId}">
        </div>
        <div class="col-12" id="${overviewitemTableContainerId}">
        </div>
        <div class="col-12" id="${overviewCumulativePlotId}">
        </div>
    </div>
`;

var itemLayout =
`
   <div class="row">
        <div class="col-12" id="${itemSalesPlotId}">
        </div>
        <div class="col-12" id="${itemSalesHistogramPlotId}">
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

function generateItemSelectElement()
{
	var selectElement = document.createElement('select');
	selectElement.id = itemSelectElementId;
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

	for (var i = 0; i < itemNames.length; i++)
	{
		var itemName = itemNames[i];

		var optionElement = document.createElement('option');
		optionElement.value = itemName;
		optionElement.innerHTML = itemName;

		if (itemName == selected)
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
	application.loadingScreen.reportProgress(progressAfterItemListLoaded, 'Item list loaded.');

	// Wrap in timeout so that the browser surely can render the loading screen
	setTimeout(function ()
	{
		var selectedItemName = Request.get(selectedGetParameter);
		var overview = selectedItemName == null || selectedItemName == '' || selectedItemName == overviewString;

		var contentElement = document.createElement('div');
		contentElement.appendChild(generateItemSelectElement());

		if (overview)
		{
			loadOverviewData(renderOverview);
		}
		else
		{
			loadItemData(selectedItemName, renderItem);
		}
	}, 100);

}

function renderItem()
{
	var selectedItemName = Request.get(selectedGetParameter);

	var contentElement = document.createElement('div');
	contentElement.appendChild(generateItemSelectElement());

	contentElement.insertAdjacentHTML('beforeend', itemLayout);

	application.setContent(contentElement, false);

	selectedItemDataJsedResult = itemDataJsedResultsByName[selectedItemName];

	
	var parameterInputs = [];
	parameterInputs.push(`<input name="maSpan" type="number" data-label="MA Span:" value="30">`);
	parameterInputs.push(unitSelectHtml);

	Plot.plotCardWithParameters(itemSalesPlotId, 'Sales', getItemSalesData, {}, {}, parameterInputs);

	var histogramParameterInputs = [];
	histogramParameterInputs.push(`<input name="bins" type="number" data-label="Bins:" value="100">`);
	histogramParameterInputs.push(`<input name="startDate" type="date" data-label="Start Date:" value="2000-01-01"  style="width: 7rem">`);
	histogramParameterInputs.push(`<input name="endDate" type="date" data-label="End Date:" value="${new Date().toJSON().slice(0, 10)}" style="width: 7rem">`);
	histogramParameterInputs.push(unitSelectHtml);

	Plot.plotCardWithParameters(itemSalesHistogramPlotId, 'Distribution of Sales', getItemSalesHistogramData, {}, {}, histogramParameterInputs);

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
		contentElement.appendChild(generateItemSelectElement());

		contentElement.insertAdjacentHTML('beforeend', overviewLayout);

		application.setContent(contentElement, false);

		var meanStdLayoutOptions =
		{
			xaxis:
			{
				title:
				{
					text: 'STD'
				},
			},
			yaxis:
			{
				title:
				{
					text: 'Mean'
				}
			}
		};

		var cumulativeSalesLayoutOptions =
		{
			yaxis:
			{
				title:
				{
					text: 'Sales'
				}
			}
		};

		//Plot.plotWithOneParameter('Mean & Standard Deviation of Sales All Time', overviewMeanStdPlotId, getOverviewMeanStdData, meanStdLayoutOptions, {}, 10, 'Min Times Served');

		var parameterInputs = [];
		parameterInputs.push(`<input name="minTimesServed" type="number" data-label="Min Times Served:" value="10" style="width: 4rem">`);
		parameterInputs.push(`<input name="startDate" type="date" data-label="Start Date:" value="2000-01-01"  style="width: 7rem">`);
		parameterInputs.push(`<input name="endDate" type="date" data-label="End Date:" value="${new Date().toJSON().slice(0, 10)}" style="width: 7rem">`);
		parameterInputs.push(unitSelectHtml);

		Plot.plotCardWithParameters(overviewPlotId, 'Mean & Standard Deviation of Sales', getOverviewMeanStdData, meanStdLayoutOptions, {}, parameterInputs);

		Card.generateCardWithParameters(overviewitemTableContainerId, itemTableCardHeading, parameterInputs, function (contentElementId, parameterValues)
		{
			document.getElementById(contentElementId).appendChild(getOverviewItemTable(parameterValues));

			reloadOverviewItemTableCheckboxStates();
			new Tablesort(document.getElementById(overviewItemTableId));
		});

		var cumulativeSalesParameterInputs = [];
		cumulativeSalesParameterInputs.push(`<input name="maSpan" type="number" data-label="MA Span:" value="30">`);
		cumulativeSalesParameterInputs.push(unitSelectHtml);

		Plot.plotCardWithParameters(overviewCumulativePlotId, 'Cumulative Sales (CS)', getOverviewCumulativeData, cumulativeSalesLayoutOptions, {}, cumulativeSalesParameterInputs);

		application.loadingScreen.reportProgress(progressAfterRender, 'Rendering completed');
		application.loadingScreen.hideLoadingScreen();

	}, 100);

}

// Data loading functions

function getItemDataPath(itemName)
{
	return itemDataPathPrefix + itemName + itemDataPathSuffix;
}

function loadItemData(itemName, onComplete)
{
	JSED.parse(getItemDataPath(itemName), function (itemDataJsedResult)
	{
		itemDataJsedResultsByName[itemName] = itemDataJsedResult;
		onComplete();
	});
}

function loadOverviewData(onComplete)
{
	var completed = 0;
	var c = itemNames.length;
	for (let i = 0; i < c; i++)
	{
		let itemName = itemNames[i];

		loadItemData(itemName, function ()
		{
			var progress = Math.round(progressAfterItemListLoaded + (progressAfterOverviewDataLoaded - progressAfterItemListLoaded) * completed / itemNames.length);
			application.loadingScreen.reportProgress(progress, 'Loaded data for item: ' + itemName);

			completed++;
			if (completed >= c)
			{
				onComplete();
			}
		});
	}
}

// Data generation functions

function getItemSalesData(params)
{
	var unit = params.unit;
	var maSpan = params.maSpan;

	var itemData = selectedItemDataJsedResult.getAny().data;
	var amountSoldByDateGroupedByItem = DataHandler.getSumByDateGroupedByCategory(itemData, ['Students', 'Non students'], unit, 'customer_category');

	var datesTotal = Object.keys(amountSoldByDateGroupedByItem['Total']);
	var datesStudents = Object.keys(amountSoldByDateGroupedByItem['Students']);
	var datesNonStudents = Object.keys(amountSoldByDateGroupedByItem['Non students']);

	var amountTotalValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByItem['Total']), maSpan);
	var amountStudentValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByItem['Students']), maSpan);
	var amountNonStudentValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByItem['Non students']), maSpan);

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

function getItemSalesHistogramData(params)
{
	var unit = params.unit;
	var bins = params.bins;
	var startDate = params.startDate;
	var endDate = params.endDate;

	var itemData = selectedItemDataJsedResult.getAny().data;

	var amountSoldByDateGroupedByItem = DataHandler.getSumByDateGroupedByCategory(itemData, ['Students', 'Non students'], unit, 'customer_category', startDate, endDate);

	var amountTotalValues = Object.values(amountSoldByDateGroupedByItem['Total']);
	var amountStudentValues = Object.values(amountSoldByDateGroupedByItem['Students']);
	var amountNonStudentValues = Object.values(amountSoldByDateGroupedByItem['Non students']);

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
	var unit = params.unit;
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

	for (var itemJsedResultName in itemDataJsedResultsByName)
	{
		var itemJsedResult = itemDataJsedResultsByName[itemJsedResultName];
		var itemData = itemJsedResult.getAny().data;

		var amountSoldByDateGroupedByItem = DataHandler.getSumByDateGroupedByCategory(itemData, ['Students', 'Non students'], unit, 'customer_category', startDate, endDate);

		var amountTotalValues = Object.values(amountSoldByDateGroupedByItem['Total']);
		var amountStudentValues = Object.values(amountSoldByDateGroupedByItem['Students']);
		var amountNonStudentValues = Object.values(amountSoldByDateGroupedByItem['Non students']);

		if (amountTotalValues.length >= minTimesServed)
		{
			meanAmountStudent.push(math.mean(amountStudentValues));
			stdAmountStudent.push(math.std(amountStudentValues));

			meanAmountNonStudent.push(math.mean(amountNonStudentValues));
			stdAmountNonStudent.push(math.std(amountNonStudentValues));

			meanAmountTotal.push(math.mean(amountTotalValues));
			stdAmountTotal.push(math.std(amountTotalValues));

			dataLabels.push(Path.basenameWithoutFileExtension(itemJsedResult.src));
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

function getOverviewCumulativeData(params)
{
	var unit = params.unit;
	var maSpan = params.maSpan;

	var cumSalesItemDataTotal = [];
	var cumSalesItemDataStudents = [];
	var cumSalesItemDataNonStudents = [];
	var itemTableBodyElement = document.getElementById(overviewItemTableBodyId);

	for (var i = 0; i < itemTableBodyElement.children.length; i++)
	{
		var tableRow = itemTableBodyElement.children[i];
		var checkbox = tableRow.children[0].children[0];

		if (checkbox.checked)
		{
			var data = itemDataJsedResultsByName[checkbox.name].getAny().data;
			var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(data, ['Students', 'Non students'], unit, 'customer_category');

			cumSalesItemDataTotal.push(amountSoldByDateGroupedByCategory['Total']);
			cumSalesItemDataStudents.push(amountSoldByDateGroupedByCategory['Students']);
			cumSalesItemDataNonStudents.push(amountSoldByDateGroupedByCategory['Non students']);
		}
	}
	var sumByDateTotal = Math.sumByKey(cumSalesItemDataTotal);
	var sumByDateStudents = Math.sumByKey(cumSalesItemDataStudents);
	var sumByDateNonStudents = Math.sumByKey(cumSalesItemDataNonStudents);

	var traceTotal =
	{
		x: Object.keys(sumByDateTotal),
		y: Statistics.movingAverage(Object.values(sumByDateTotal), maSpan),
		type: 'scatter',
		name: 'Total'
	};

	var traceStudents =
	{
		x: Object.keys(sumByDateStudents),
		y: Statistics.movingAverage(Object.values(sumByDateStudents), maSpan),
		type: 'scatter',
		name: 'Students'
	};

	var traceNonStudents =
	{
		x: Object.keys(sumByDateNonStudents),
		y: Statistics.movingAverage(Object.values(sumByDateNonStudents), maSpan),
		type: 'scatter',
		name: 'Non students'
	};

	return [traceTotal, traceStudents, traceNonStudents];
}

// Item table functions

function getOverviewItemTable(params)
{
	var unit = params.unit;
	var minTimesServed = math.max(params.minTimesServed, 1);
	var startDate = params.startDate;
	var endDate = params.endDate;

	var itemTableContainer = document.createElement('div');
	itemTableContainer.className = Css.overviewTableContainerClassNames;

	var itemTable = document.createElement('table');
	itemTable.className = Css.overviewTableClassNames;
	itemTable.id = overviewItemTableId;

	itemTable.innerHTML +=
	`
        <thead>
            <tr>
                <th>
                    CS
                </th>
                <th>
                    Item Name
                </th>
                <th>
                    Times Served
                </th>
                <th>
                    Last Served
                </th>
                <th>
                    Min
                </th>
                <th>
                    Max
                </th>
                <th>
                    Mean
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
	tableBodyElement.id = overviewItemTableBodyId;

	for (var itemJsedResultName in itemDataJsedResultsByName)
	{
		var itemJsedResult = itemDataJsedResultsByName[itemJsedResultName];
		var itemData = itemJsedResult.getAny().data;

		var amountSoldByDateGroupedByItem = DataHandler.getSumByDateGroupedByCategory(itemData, ['Students', 'Non students'], unit, 'customer_category', startDate, endDate);

		var totalDates = Object.keys(amountSoldByDateGroupedByItem['Total']);

		if (totalDates.length < minTimesServed)
		{
			continue;
		}

		if (totalDates[totalDates.length - 1] == 'random')
		{
			console.log(totalDates);
		}

		var amountTotalValues = Object.values(amountSoldByDateGroupedByItem['Total']);
		var amountStudentValues = Object.values(amountSoldByDateGroupedByItem['Students']);
		var amountNonStudentValues = Object.values(amountSoldByDateGroupedByItem['Non students']);

		var getParams = {};
		getParams[selectedGetParameter] = itemJsedResultName;

		var trendTotal = math.round(Statistics.linearRegression(amountTotalValues).slope, 2);
		var trendStudents = math.round(Statistics.linearRegression(amountStudentValues).slope, 2);
		var trendNonStudents = math.round(Statistics.linearRegression(amountNonStudentValues).slope, 2);

		var tableRowInnerHtml =
		`
            <td>
                <input type="checkbox" name="${itemJsedResultName}" onchange="onOverviewItemTableCheckboxChange(this);">
            </td>
            <td>
                <a href="${UrlGenerator.getCurrentUrlWithGetParameters(getParams)}">
                    ${itemJsedResultName}
                </a>
            </td>
            <td>
                ${amountTotalValues.length}
            </td>
            <td>
                ${totalDates[totalDates.length - 1]}
            </td>
            <td>
                ${getOverviewItemTableFormattedNumber(math.min(amountTotalValues))}
            </td>
            <td>
                ${getOverviewItemTableFormattedNumber(math.max(amountTotalValues))}
            </td>
            <td>
                ${getOverviewItemTableFormattedNumber(math.mean(amountTotalValues))}
            </td>
            <td ${getOverviewItemTableTrendStyle(trendTotal)}>
                ${getOverviewItemTableFormattedNumber(trendTotal)}
            </td>
            <td ${getOverviewItemTableTrendStyle(trendStudents)}>
                ${getOverviewItemTableFormattedNumber(trendStudents)}
            </td>
            <td ${getOverviewItemTableTrendStyle(trendNonStudents)}>
                ${getOverviewItemTableFormattedNumber(trendNonStudents)}
            </td>
        `;

		var tableRow = document.createElement('tr');
		tableRow.innerHTML = tableRowInnerHtml;

		tableBodyElement.appendChild(tableRow);

	}

	itemTable.appendChild(tableBodyElement);

	itemTableContainer.appendChild(itemTable);

	return itemTableContainer;
}

function getOverviewItemTableFormattedNumber(number)
{
	return parseFloat(Math.round(number * 100) / 100).toFixed(2);
}

function getOverviewItemTableTrendStyle(trendValue)
{
	if (trendValue < 0)
	{
		return 'style="background: rgba(255, 0, 0, 0.4);"';
	}
	else if (trendValue > 0)
	{
		return 'style="background: rgba(0, 255, 0, 0.4);"';
	}
	else
	{
		return 'style="background: rgba(255, 255, 0, 0.4);"';
	}
}

function onOverviewItemTableCheckboxChange(checkbox)
{
	checkedItemNames[checkbox.name] = checkbox.checked;
}

function reloadOverviewItemTableCheckboxStates()
{
	var itemTableBodyElement = document.getElementById(overviewItemTableBodyId);
	for (var i = 0; i < itemTableBodyElement.children.length; i++)
	{
		var tableRow = itemTableBodyElement.children[i];
		var checkbox = tableRow.children[0].children[0];

		if (checkbox.name in checkedItemNames)
		{
			checkbox.checked = checkedItemNames[checkbox.name];
		}
	}
}

// Initialization call
// Load the item list and then render according to selection.

JSED.parse(itemListPath, function (itemListJsedResult)
{
	itemNames = itemListJsedResult.getAny().data.sort();

	render();

	window.onhashchange = render;

});

