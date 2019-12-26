var titleCardId = 'title';
var dataInfoCardId = 'data-state-card';
var dataUpdatedId = 'data-updated';
var previousDataUpdateStartedId = 'prev-data-update-started';

var layout =
`	
	<div class="row">
		<div class="col-12" id="${titleCardId}">
		</div>
		<div class="col-12" id="${dataInfoCardId}">
		</div>
	</div>
`;

var dataInfoCardContent = 
`
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

var contentElement = document.createElement('div');
contentElement.innerHTML = layout;

application.setContent(contentElement, false);

Card.generateTitleCard(titleCardId, 'Data State');

Card.generateCard(dataInfoCardId, 'Data Info', function (contentElementId)
{
	var updateDataButton = document.createElement('button');
	updateDataButton.className = Css.primaryButtonClassNames;
	updateDataButton.innerHTML = 'Force Data Update Now';
	updateDataButton.onclick = onForceUpdateDataClicked;

	document.getElementById(contentElementId).innerHTML = dataInfoCardContent;
	document.getElementById(contentElementId).appendChild(updateDataButton);

	var dataStateXhr = new XMLHttpRequest();

	dataStateXhr.onload = function ()
	{
		var data = JSON.parse(dataStateXhr.response);

		document.getElementById(dataUpdatedId).innerHTML = data['last_update_date'];
		document.getElementById(previousDataUpdateStartedId).innerHTML = data['last_update_start_date'];

	};

	dataStateXhr.open('POST', Urls.dataStateUrl);

	dataStateXhr.send();
});

application.loadingScreen.loadingCompleted();