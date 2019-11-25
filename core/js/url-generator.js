class UrlGenerator
{
	static databaseTableDataViewUrl(tableName)
	{
		var getParameters = {};
		getParameters[Urls.tableNameGetParameter] = tableName;

		return '#' + Urls.databaseTableDataViewUrlBase + Urls.getParameterString(getParameters);
	}

	static getCurrentUrlWithGetParameters(parameterValueDictionary)
	{
		var currentUrl = window.location.href.split('#')[0];

		return currentUrl + UrlGenerator.getCurrentHashWithGetParameters(parameterValueDictionary);
	}

	static getCurrentHashWithGetParameters(parameterValueDictionary)
	{
		var currentHash = window.location.href.split('#')[1].split('?')[0];

		return '#' + currentHash + Urls.getParameterString(parameterValueDictionary);
	}


}
