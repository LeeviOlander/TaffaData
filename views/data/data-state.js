var contentElement = document.createElement('div');

var layout =
`	
    <h1>
        Data State
    </h1>

    <p>
        <strong>
            Data Updated:      
        </strong>
        xxxx-xx-xx
    </p>


    <p>
        <strong>
            Previous Data Update Started:      
        </strong>
        xxxx-xx-xx
    </p>


    <p>
        <strong>
            Zipped Data:      
        </strong>
        <a href="${Urls.zippedDataPackageUrl}">
            data-package.zip
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
					if (xhr.response.toLowerCase().includes('error'))
					{
						bootbox.alert({
							title: "Error",
							message: xhr.response,
							centerVertical: true,
							closeButton: false
						});
					}
					else
					{
						bootbox.alert({
							title: "Success",
							message: xhr.response,
							centerVertical: true,
							closeButton: false
						});
					}

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

			}
		}
	});

	
}

contentElement.innerHTML = layout;

var updateDataIfNeededButton = document.createElement('button');
updateDataIfNeededButton.className = Css.primaryButtonClassNames;
updateDataIfNeededButton.innerHTML = 'Update Data If Needed';

var spacer = document.createElement('span');
spacer.style.width = '1rem';
spacer.style.height = '1rem';
spacer.style.display = 'inline-block';

var updateDataButton = document.createElement('button');
updateDataButton.className = Css.primaryButtonClassNames;
updateDataButton.innerHTML = 'Force Data Update Now';
updateDataButton.onclick = onForceUpdateDataClicked;

contentElement.appendChild(updateDataIfNeededButton);
contentElement.appendChild(spacer);
contentElement.appendChild(updateDataButton);

application.setContent(contentElement);