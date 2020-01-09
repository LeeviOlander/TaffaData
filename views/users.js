var titleCardId = 'title';
var usersAdmin = 'users-admin';
var usersStandard = 'users-standard';

var usersAdminTextareaName = 'users-admin';
var usersStandardTextareaName = 'users-standard';

var usersAdminTextareaId = 'users-admin-textarea';
var usersStandardTextareaId = 'users-standard-textarea';

var usersAdminFormId = 'users-admin-form';
var usersStandardFormId = 'users-standard-form';

var usersAdminSaveButtonId = 'users-admin-save-button';
var usersStandardSaveButtonId = 'users-standard-save-button';

var layout =
`	
	<div class="row">
		<div class="col-12" id="${titleCardId}">
		</div>
		<div class="col-12" id="${usersAdmin}">
		</div>
		<div class="col-12" id="${usersStandard}">
		</div>
	</div>
`;

var adminUsersContent =
`
    <p>
        Admin user capabilities:
    </p>

    <ol>
        <li>
            Access TäffäData
        </li>
        <li>
            Force data reload
        </li>
        <li>
            Edit the list of users with admin access
        </li>
        <li>
            Edit the list of users with standard access
        </li>
    </ol>

    <form id="${usersAdminFormId}">
        <div class="form-group">
            <label for="${usersAdminTextareaId}">
                <strong>Users With Admin Access (one TF account id per row)</strong>
            </label>
            <textarea class="form-control" id="${usersAdminTextareaId}" name="${usersAdminTextareaName}" style="min-height: 10rem"></textarea>
        </div>
    </form>
    <br>
    <button class="btn btn-primary" id="${usersAdminSaveButtonId}">
        Save
    </button>
`;

var standardUsersContent =
`
    <p> 
        Standard user capabilities:
    </p>

    <ol>
        <li>
            Access TäffäData
        </li>
    </ol>

    <form id="${usersStandardFormId}">
        <div class="form-group">
            <label for="${usersStandardTextareaId}">
                <strong>Users With Standard Access (one TF account id per row)</strong>
            </label>
            <textarea class="form-control" id="${usersStandardTextareaId}" name="${usersStandardTextareaName}" style="min-height: 10rem"></textarea>
        </div>
    </form>
    <br>
    <button class="btn btn-primary" id="${usersStandardSaveButtonId}">
        Save
    </button>
`;

function onSaveAdminUsers()
{
	bootbox.confirm({
		title: "Confirm Action",
		message: "Are you sure that you want save the list of users with admin access?",
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

				xhr.open('POST', Urls.saveAdminUsers);

				xhr.send(new FormData(document.getElementById(usersAdminFormId)));
			}
		}
	});
}

function onSaveStandardUsers()
{
	bootbox.confirm({
		title: "Confirm Action",
		message: "Are you sure that you want save the list of users with standard access?",
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

				xhr.open('POST', Urls.saveStandardUsers);

				xhr.send(new FormData(document.getElementById(usersStandardFormId)));
			}
		}
	});
}

application.setContent(layout, false);

Card.generateTitleCard(titleCardId, 'Users');

Card.generateCard(usersAdmin, 'Admin Users', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = adminUsersContent;
});

Card.generateCard(usersStandard, 'Standard Users', function (contentElementId)
{
	document.getElementById(contentElementId).innerHTML = standardUsersContent;

	document.getElementById(usersAdminSaveButtonId).onclick = onSaveAdminUsers;
	document.getElementById(usersStandardSaveButtonId).onclick = onSaveStandardUsers;

	var getAdminUsersXhr = new XMLHttpRequest();
	var getStandardUsersXhr = new XMLHttpRequest();

	getAdminUsersXhr.onload = function ()
	{
		document.getElementById(usersAdminTextareaId).value = getAdminUsersXhr.response;
	};

	getAdminUsersXhr.onerror = function ()
	{
		document.getElementById(usersAdminTextareaId).value = "Network error";
	};

	getStandardUsersXhr.onload = function ()
	{
		document.getElementById(usersStandardTextareaId).value = getStandardUsersXhr.response;
	};

	getStandardUsersXhr.onerror = function ()
	{
		document.getElementById(usersStandardTextareaId).value = "Network error";
	};

	getAdminUsersXhr.open('POST', Urls.getAdminUsers);
	getStandardUsersXhr.open('POST', Urls.getStandardUsers);

	getAdminUsersXhr.send();
	getStandardUsersXhr.send();


});

application.loadingScreen.loadingCompleted();