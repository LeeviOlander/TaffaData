var contentElement = document.createElement('div');

var dataUpdatedId = 'data-updated';
var previousDataUpdateStartedId = 'prev-data-update-started';

var layout =
`	
    <h1>
        Data State
    </h1>

    <p>
        <strong>
            Data Updated:      
        </strong>
        <span id="${dataUpdatedId}">
            xxxx-xx-xx
        </span>
    </p>


    <p>
        <strong>
            Previous Data Update Started:      
        </strong>
        <span id="${previousDataUpdateStartedId}">
            xxxx-xx-xx
        </span>
    </p>


    <p>
        <strong>
            Zipped Data:      
        </strong>
        <a href="${Urls.dataPackageUrl}">
            Download
        </a>
    </p>

    <br>
`;

function onForceUpdateDataClicked()
{
	bootbox.confirm({
        title: "Confirm Force Update",
		message: "" +
            "Are you sure that you want to update the data now? Generally, you should let the server decide when to update the data. " +
			"Executing this action will launch a new data updating process, which may interfere with ongoing data updating processes." +
            "<br><br>" + 
			"<strong>It is not recommended to execute this manually!</strong>" +
            "<br><br>" + 
            "<strong>This action requires elevated access rights! </strong>",
		centerVertical: true,
		closeButton: false,
		callback: function (result)
		{
			if (result)
			{
				var xhr = new XMLHttpRequest();

				xhr.onload = function ()
				{
					bootbox.alert({
						title: "Response",
						message: xhr.response,
						centerVertical: true,
						closeButton: false
					});

				};

				xhr.onerror = function ()
				{
					bootbox.alert({
						title: "Error",
						message: "Network error.",
						centerVertical: true,
						closeButton: false
					});
				};

				xhr.open('POST', Urls.updateDataUrl);

				xhr.send();

			}
		}
	});

	
}

contentElement.innerHTML = layout;

var updateDataButton = document.createElement('button');
updateDataButton.className = Css.primaryButtonClassNames;
updateDataButton.innerHTML = 'Force Data Update Now';
updateDataButton.onclick = onForceUpdateDataClicked;

contentElement.appendChild(updateDataButton);

var dataStateXhr = new XMLHttpRequest();

dataStateXhr.onload = function ()
{
	var data = JSON.parse(dataStateXhr.response);

	document.getElementById(dataUpdatedId).innerHTML = data['last_update_date'];
	document.getElementById(previousDataUpdateStartedId).innerHTML = data['last_update_start_date'];

};

dataStateXhr.open('POST', Urls.dataStateUrl);

dataStateXhr.send();

application.setContent(contentElement);