class Urls
{
	static getParameterString(parameterValueDictionary)
	{
		var str = '?';

		for (var parameter in parameterValueDictionary)
		{
			str += parameter + '=' + parameterValueDictionary[parameter] + '&';
		}

		return str;
	}
}

Urls.databaseTableDataViewUrlBase = '';

Urls.databaseTableInformationGetUrlBase = 'server/database-tables.php';
Urls.databaseTableDataGetUrlBase = 'server/database-table-data.php';

Urls.tableNameGetParameter = 'table-name';