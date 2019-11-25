class Request
{
	static get(parameterName)
	{
		var url_string = window.location.href;
		var url = new URL(url_string.replace('#', ''));

		return url.searchParams.get(parameterName);
	}

	static getTableName()
	{
		return Request.get(Urls.tableNameGetParameter);
	}
    
}
