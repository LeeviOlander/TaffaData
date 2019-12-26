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

var titleCardId = 'title';
var revenuePlotId = 'revenue';
var revenueCumulativeSumPlotId = 'cumulative-revenue';
var overviewPlotId = 'overview-data';
var overviewitemTableContainerId = 'overview-feedback';

var categorySalesPlotId = 'category-sales';
var categorySalesHistogramPlotId = 'category-sales-histogram';

var categoryNames = [];
var categoryDataJsedResultsByName = {};
var selectedCategoryDataJsedResult = null;

// Layouts

var overviewLayout =
	`
    <div class="row">
		<div class="col-12" id="${titleCardId}">
		</div>
        <div class="col-12" id="${revenuePlotId}">
        </div>
        <div class="col-12" id="${revenueCumulativeSumPlotId}">
        </div>
        <div class="col-12" id="${overviewPlotId}">
        </div>
        <div class="col-12" id="${overviewitemTableContainerId}">
        </div>
    </div>
`;

// Render functions

function render()
{
	application.loadingScreen.showLoadingScreen();
	application.loadingScreen.reportProgress(progressAfterCategoryListLoaded, 'Category list loaded.');

	// Wrap in timeout so that the browser surely can render the loading screen
	setTimeout(function ()
	{
		loadOverviewData(renderOverview);
	}, 100);

}

function renderOverview()
{
	// Wrap in time out, so that browser may rerender the loading screen.
	// The rendering process is so slow that this is needed.
	setTimeout(function ()
	{
		var contentElement = document.createElement('div');

		contentElement.innerHTML = overviewLayout;

		application.setContent(contentElement, false);


		Card.generateTitleCard(titleCardId, '<img src="core/assets/logo.png" style="height: 2.5rem">', 
		`
			<strong>TäffäData</strong> is a data visualization application for the data collected by <a href="https://about.teknologforeningen.fi/index.php/en/lunch-restaurant">Teknologföreningen\'s restaurant.</a>
		`);
 

		var revenueByDayLayoutOptions =
		{
			yaxis:
			{
				title:
				{
					text: 'Revenue (€)'
				}
			}
		};

		var feedbackLayoutOptions =
		{
			yaxis:
			{
				title:
				{
					text: 'Amount'
				}
			}
		};

		var revenueParameterInputs = [];
		revenueParameterInputs.push(`<input name="maSpan" type="number" data-label="MA Span:" value="30">`);

		Plot.plotCardWithParameters(revenuePlotId, 'Revenue by Day', getRevenueByDay, revenueByDayLayoutOptions, {}, revenueParameterInputs);

		var parameterInputs = [];
		parameterInputs.push(`<input name="maSpan" type="number" data-label="MA Span:" value="30">`);
		parameterInputs.push(unitSelectHtml);

		Plot.plotCardWithParameters(overviewPlotId, 'Sales by Category', getOverviewData, {}, {}, parameterInputs);

		var feedbackParameterInputs = [];
		feedbackParameterInputs.push(`<input name="maSpan" type="number" data-label="MA Span:" value="30">`);

		Plot.plotCardWithParameters(overviewitemTableContainerId, 'Pebbles Feedback', getPebblesFeedbackData, feedbackLayoutOptions, {}, feedbackParameterInputs);

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

function getRevenueByDay(params)
{
	var unit = 'revenue';
	var maSpan = params.maSpan;

	var cumSalesItemDataTotal = [];
	var cumSalesItemDataStudents = [];
	var cumSalesItemDataNonStudents = [];

	for (var name in categoryDataJsedResultsByName)
	{
		var data = categoryDataJsedResultsByName[name].getAny().data;
		var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(data, ['Students', 'Non students'], unit, 'customer_category');

		cumSalesItemDataTotal.push(amountSoldByDateGroupedByCategory['Total']);
		cumSalesItemDataStudents.push(amountSoldByDateGroupedByCategory['Students']);
		cumSalesItemDataNonStudents.push(amountSoldByDateGroupedByCategory['Non students']);
	}
	var sumByDateTotal = Math.trimStart(Math.sumByKey(cumSalesItemDataTotal));
	var sumByDateStudents = Math.trimStart(Math.sumByKey(cumSalesItemDataStudents));
	var sumByDateNonStudents = Math.trimStart(Math.sumByKey(cumSalesItemDataNonStudents));

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

function getCumulativeRevenueByDay(params)
{
	var unit = 'revenue';
	var maSpan = params.maSpan;

	var cumSalesItemDataTotal = [];
	var cumSalesItemDataStudents = [];
	var cumSalesItemDataNonStudents = [];

	for (var name in categoryDataJsedResultsByName)
	{
		var data = categoryDataJsedResultsByName[name].getAny().data;
		var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(data, ['Students', 'Non students'], unit, 'customer_category');

		cumSalesItemDataTotal.push(amountSoldByDateGroupedByCategory['Total']);
		cumSalesItemDataStudents.push(amountSoldByDateGroupedByCategory['Students']);
		cumSalesItemDataNonStudents.push(amountSoldByDateGroupedByCategory['Non students']);
	}

	var sumByDateTotal = Math.sumByKey(cumSalesItemDataTotal);
	var sumByDateStudents = Math.sumByKey(cumSalesItemDataStudents);
	var sumByDateNonStudents = Math.sumByKey(cumSalesItemDataNonStudents);

	var traceTotal =
	{
		x: Object.keys(sumByDateTotal),
		y: Statistics.movingAverage(Math.cumSum(Object.values(sumByDateTotal)), maSpan),
		type: 'scatter',
		name: 'Total'
	};

	var traceStudents =
	{
		x: Object.keys(sumByDateStudents),
		y: Statistics.movingAverage(Math.cumSum(Object.values(sumByDateStudents)), maSpan),
		type: 'scatter',
		name: 'Students'
	};

	var traceNonStudents =
	{
		x: Object.keys(sumByDateNonStudents),
		y: Statistics.movingAverage(Math.cumSum(Object.values(sumByDateNonStudents)), maSpan),
		type: 'scatter',
		name: 'Non students'
	};

	return [traceTotal, traceStudents, traceNonStudents];
}

function getOverviewData(params)
{
	var unit = params.unit;
	var maSpan = params.maSpan;

	var traces = [];

	for (var categoryJsedResultName in categoryDataJsedResultsByName)
	{
		var categoryJsedResult = categoryDataJsedResultsByName[categoryJsedResultName];
		var categoryData = categoryJsedResult.getAny().data;

		var amountSoldByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(categoryData, ['Students', 'Non students'], unit, 'customer_category');

		var amountTotalDates = Object.keys(amountSoldByDateGroupedByCategory['Total']);
		var amountStudentDates = Object.keys(amountSoldByDateGroupedByCategory['Students']);
		var amountNonStudentDates = Object.keys(amountSoldByDateGroupedByCategory['Non students']);

		var amountTotalValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByCategory['Total']), maSpan);
		var amountStudentValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByCategory['Students']), maSpan);
		var amountNonStudentValues = Statistics.movingAverage(Object.values(amountSoldByDateGroupedByCategory['Non students']), maSpan);

		var traceTotal =
		{
			x: amountTotalDates,
			y: amountTotalValues,
			type: 'scatter',
			name: categoryJsedResultName + ' Total'
		};

		var traceStudents =
		{
			x: amountStudentDates,
			y: amountStudentValues,
			type: 'scatter',
			name: categoryJsedResultName + ' Students'
		};

		var traceNonStudents =
		{
			x: amountNonStudentDates,
			y: amountNonStudentValues,
			type: 'scatter',
			name: categoryJsedResultName + ' Non students'
		};

		traces.push(traceTotal);
		traces.push(traceStudents);
		traces.push(traceNonStudents);
	}

	return traces;
}

function getPebblesFeedbackData(params)
{
	var maSpan = params.maSpan;

	var traces = [];

	var mainLunchJsedResult = categoryDataJsedResultsByName['Paalounas'];

	var mainLunchData = mainLunchJsedResult.getAny().data;

	var positiveFeedbackByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(mainLunchData, [], 'positive_feedback', 'customer_category');
	var negativeFeedbackByDateGroupedByCategory = DataHandler.getSumByDateGroupedByCategory(mainLunchData, [], 'negative_feedback', 'customer_category');

	var totalPositiveFeedbackByDay = Math.trimStart(Math.divideByKey(positiveFeedbackByDateGroupedByCategory['Total'], positiveFeedbackByDateGroupedByCategory['itemCountByDate']), -1);
	var totalNegativeFeedbackByDay = Math.trimStart(Math.divideByKey(negativeFeedbackByDateGroupedByCategory['Total'], negativeFeedbackByDateGroupedByCategory['itemCountByDate']), -1);

	var positiveFeedbackDates = Object.keys(totalPositiveFeedbackByDay);
	var negativeFeedbackDates = Object.keys(totalNegativeFeedbackByDay);

	var positiveFeedbackValues = Statistics.movingAverage(Object.values(totalPositiveFeedbackByDay), maSpan);
	var negativeFeedbackValues = Statistics.movingAverage(Object.values(totalNegativeFeedbackByDay), maSpan);

	var tracePositiveFeedback =
	{
		x: positiveFeedbackDates,
		y: positiveFeedbackValues,
		type: 'scatter',
		name: 'Positive Feedback'
	};

	var traceNegativeFeedback =
	{
		x: negativeFeedbackDates,
		y: negativeFeedbackValues,
		type: 'scatter',
		name: 'Negative Feedback'
	};

	traces.push(tracePositiveFeedback);
	traces.push(traceNegativeFeedback);

	return traces;
}

// Initialization call
// Load the item list and then render according to selection.

JSED.parse(categoryListPath, function (categoryListJsedResult)
{
	categoryNames = categoryListJsedResult.getAny().data.sort();

	render();

	window.onhashchange = render;

});

