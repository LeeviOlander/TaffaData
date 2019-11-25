class ServerUrlGenerator
{
	static databaseTableInformationGetUrl()
	{
		return Urls.databaseTableInformationGetUrlBase;
	}

	static databaseTableDataGetUrl(tableName)
	{
		var getParameters = {};
		getParameters[Urls.tableNameGetParameter] = tableName;

		return Urls.databaseTableDataGetUrlBase + Urls.getParameterString(getParameters);
	}

	
}