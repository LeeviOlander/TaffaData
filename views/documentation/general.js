var converter = new showdown.Converter();

var titleCardId = 'title';
var objectivesCardId = 'terminology';

var layout =
`
    <div class="row">
        <div class="col-12" id="${titleCardId}">
        </div>
        <div class="col-12" id="${objectivesCardId}">
        </div>
    </div>
`;

var objectivesCardMarkdownContent =
`	

1. **MA Span**

    Moving Average Span. Used to filter out noise from the data. A value of 1 for this will return the
    untransformed data. Note: This is a lagging transformation. See [Moving average at Wikipedia](https://en.wikipedia.org/wiki/Moving_average)
    for more information.

	<br>

1. **Min Times Served** 

    Minimum Times Served. Used to filter out items, which have not been served (or sold) at least
    this many times within a given time span.

	<br>

1. **Start Date** and **End Date**

    Used to define a time span, which then defines the data that is to be used for
    a calculation or rendering. Due to the periodicity of the data, it is recommended to use the same day and month for
    both the **Start Date** and **End Date**. However, this is not necessary.

	<br>

1. **Unit: Quantity** or **Revenue (€)** 

    Used to change the unit in which the data and plots are evaluated. Note that
    the unit **Revenue (€)** is unreliable in some scenarios. For example, the revenue for lunch tickets are calculated for
    the day that they were actually sold. This may then translate to seemingly worse performance for a product or category,
    than what would actually be justified. Additionally, the revenue does not (seemingly) take in to account the Kela support.
    Nonetheless, the "Revenue by Day" plot on the front page is quite reliable, since it sums up all transactions for each day.
    The reliability stems from the fact that summing up the partial revenues does not lead to a situation where products or 
    categories would have to be compared with each other.

	<br>

1. **Total Trend**, **Students Trend** and **Non Students Trend**

    These values represent the slope of the linear regression for
    their respective data sets. When inspecting these values, one has to understand that the periodicity of the data has to be
    accounted for. See the recommendation in "**Start Date** and **End Date**". The value can be interpreted as follows: "For
    each day, during the defined time span, the change has, on average, been this".

	<br>

1. **Bins** 

    The preferred number of bins in a histogram plot. 

`;

var contentElement = document.createElement('div');

contentElement.innerHTML = layout;

application.setContent(contentElement, false);

Card.generateTitleCard(titleCardId, 'General Documentation');

Card.generateCardWithParameters(objectivesCardId, 'Terminology', [], function (contentElementId, parameterValues)
{
	document.getElementById(contentElementId).innerHTML = converter.makeHtml(objectivesCardMarkdownContent);
});



application.loadingScreen.loadingCompleted();